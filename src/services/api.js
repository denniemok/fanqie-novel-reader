import { API_BASE_KEY, API_OPTIONS, REQUEST_TIMEOUT_MS, RATE_LIMIT_RPM } from '../utils/constants';
import { httpErrorFromResponse } from '../utils/errors';
import { safeGetItem, safeSetItem, setLastReadChapter } from '../utils/storage';
import { directoryCache, chapterCache, detailCache } from '../utils/cache';

/** Backend base URL. Set VITE_BACKEND_URL in .env (empty = same-origin via Vite dev proxy). */
const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL ?? '').trim().replace(/\/$/, '');
const API_TOKEN = import.meta.env.VITE_API_TOKEN ?? '';
const DEFAULT_API_BASE = API_OPTIONS[0].value;

export function getApiBase() {
  const raw = safeGetItem(API_BASE_KEY) || DEFAULT_API_BASE;
  return API_OPTIONS.some((o) => o.value === raw) ? raw : DEFAULT_API_BASE;
}

export function setApiBase(apiId) {
  safeSetItem(API_BASE_KEY, apiId);
}

function getApiUrl(path) {
  return `${BACKEND_URL}${path}`;
}

function withApiAuthHeaders(options = {}) {
  if (!API_TOKEN) return options;
  return {
    ...options,
    headers: {
      ...options.headers,
      'X-API-Token': API_TOKEN,
    },
  };
}

function buildProxyUrl(action, params) {
  const api = getApiBase();
  const q = new URLSearchParams({ api, action });
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v != null && v !== '') q.set(k, String(v));
  });
  return getApiUrl(`/proxy?${q.toString()}`);
}

const RATE_LIMIT_WINDOW_MS = 60_000;
let rateLimitTail = Promise.resolve();
const rateLimitTimestamps = [];

function trimOldTimestamps(cutoff) {
  let i = 0;
  while (i < rateLimitTimestamps.length && rateLimitTimestamps[i] <= cutoff) i++;
  rateLimitTimestamps.splice(0, i);
}

async function waitForRateLimit() {
  rateLimitTail = rateLimitTail.then(async () => {
    const now = Date.now();
    trimOldTimestamps(now - RATE_LIMIT_WINDOW_MS);
    while (rateLimitTimestamps.length >= RATE_LIMIT_RPM) {
      const oldest = rateLimitTimestamps[0];
      const waitMs = Math.max(0, oldest + RATE_LIMIT_WINDOW_MS - Date.now() + 1);
      await new Promise((r) => setTimeout(r, waitMs));
      trimOldTimestamps(Date.now() - RATE_LIMIT_WINDOW_MS);
    }
    rateLimitTimestamps.push(Date.now());
  });
  await rateLimitTail;
}

async function fetchWithTimeout(fetchUrl, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  if (options.signal) {
    if (options.signal.aborted) {
      clearTimeout(timeoutId);
      throw new DOMException('The operation was aborted.', 'AbortError');
    }
    options.signal.addEventListener('abort', () => {
      clearTimeout(timeoutId);
      controller.abort();
    });
  }

  try {
    const res = await fetch(fetchUrl, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      if (timedOut) {
        throw new Error(`Request timed out after ${timeoutMs / 1000}s`);
      }
      throw err;
    }
    throw err;
  }
}

async function fetchJson(url, options = {}) {
  await waitForRateLimit();
  const res = await fetchWithTimeout(url, withApiAuthHeaders(options));
  if (!res.ok) throw await httpErrorFromResponse(res);
  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error('Invalid response from server');
  }
  if (json?.data === undefined) {
    throw new Error('Invalid response from server');
  }
  return json.data;
}

async function fetchDiscoverBookList(path, { signal } = {}) {
  const data = await fetchJson(getApiUrl(path), { signal });
  return data.books ?? [];
}

function withFetchOptions({ forceRefresh = false, signal } = {}) {
  return {
    ...(forceRefresh && { cache: 'no-store' }),
    ...(signal && { signal }),
  };
}

export async function fetchRecommendedBookList(channel, { signal } = {}) {
  return fetchDiscoverBookList(`/recommend-books?channel=${channel}`, { signal });
}

export async function fetchHomepageBookList(section, { signal } = {}) {
  return fetchDiscoverBookList(`/homepage-books?section=${section}`, { signal });
}

export async function fetchRankBookList(board, { signal } = {}) {
  return fetchDiscoverBookList(`/rank-books?board=${board}`, { signal });
}

export async function fetchBookDetail(bookId, { forceRefresh = false, signal } = {}) {
  if (!forceRefresh) {
    const cached = await detailCache.get(bookId);
    if (cached) return cached;
  }

  const url = buildProxyUrl('detail', { book_id: bookId });
  const result = await fetchJson(url, { signal });
  await detailCache.set(bookId, result);
  return result;
}

export async function fetchBookDirectory(bookId, { forceRefresh = false, signal } = {}) {
  if (!forceRefresh) {
    const cached = await directoryCache.get(bookId);
    if (cached) {
      await setLastReadChapter(bookId, null);
      return cached;
    }
  }

  const url = buildProxyUrl('directory', { book_id: bookId });
  const data = await fetchJson(url, withFetchOptions({ forceRefresh, signal }));
  await directoryCache.set(bookId, data);
  await setLastReadChapter(bookId, null);
  return data;
}

export async function fetchItem(itemId, { forceRefresh = false, signal } = {}) {
  if (!forceRefresh) {
    const cached = await chapterCache.get(itemId);
    if (cached != null) {
      return { content: cached };
    }
  }

  const url = buildProxyUrl('content', { item_id: itemId });
  const data = await fetchJson(url, { signal });
  const content = data.content ?? '';
  await chapterCache.set(itemId, content);
  return { content };
}

export async function fetchComments(bookId, { count = 20, offset = 1, signal } = {}) {
  const url = buildProxyUrl('comment', { book_id: bookId, count, offset });
  return fetchJson(url, { signal });
}

export async function fetchApiStatus({ signal } = {}) {
  return fetchJson(getApiUrl('/api-status'), { signal });
}

export async function fetchAnnouncements({ signal } = {}) {
  return fetchJson(getApiUrl('/announcements'), { cache: 'no-store', signal });
}
