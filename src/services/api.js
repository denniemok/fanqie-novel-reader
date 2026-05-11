import { API_BASE_KEY, API_OPTIONS, REQUEST_TIMEOUT_MS, RATE_LIMIT_RPM } from '../utils/constants';
import { safeGetItem, safeSetItem, setLastReadChapter } from '../utils/storage';
import { directoryCache, chapterCache, detailCache } from '../utils/cache';
import { cleanText, cleanAbstract } from '../utils/text';

/** Proxy URLs for round-robin. Set VITE_PROXY_URLS (comma-separated) in .env. */
const PROXY_URLS = (import.meta.env.VITE_PROXY_URLS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const DEFAULT_API_BASE = API_OPTIONS[0].value;

export function getApiBase() {
  const raw = safeGetItem(API_BASE_KEY) || DEFAULT_API_BASE;
  return API_OPTIONS.some((o) => o.value === raw) ? raw : DEFAULT_API_BASE;
}

export function setApiBase(apiId) {
  safeSetItem(API_BASE_KEY, apiId);
}

let proxyRoundRobinIndex = 0;

function getProxyBase() {
  if (PROXY_URLS.length > 0) {
    const base = PROXY_URLS[proxyRoundRobinIndex % PROXY_URLS.length];
    proxyRoundRobinIndex += 1;
    return base;
  }
  return ''; // same-origin
}

function buildProxyUrl(action, params) {
  const api = getApiBase();
  const proxyBase = getProxyBase();
  const base = proxyBase ? proxyBase.replace(/\/$/, '') : '';
  const q = new URLSearchParams({ api, action });
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v != null && v !== '') q.set(k, String(v));
  });
  return `${base}/proxy?${q.toString()}`;
}

function getFetchUrl(action, params) {
  return buildProxyUrl(action, params);
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

async function fetchAndValidate(url, options = {}) {
  await waitForRateLimit();
  const res = await fetchWithTimeout(url, options);
  if (!res.ok) throw new Error('Failed to fetch data');
  let json;
  try {
    json = await res.json();
  } catch (parseErr) {
    throw new Error('Invalid response from server');
  }
  const successOk = json.success !== undefined && json.success === true;
  const codeOk = json.code !== undefined && json.code === 0;
  if (!successOk && !codeOk) throw new Error('Failed to fetch data');
  if (successOk) return json.data;
  return json;
}

export async function fetchBookDetail(bookId, { forceRefresh = false, signal } = {}) {
  if (!forceRefresh) {
    const cached = await detailCache.get(bookId);
    if (cached) return cached;
  }

  const url = getFetchUrl('detail', { book_id: bookId });
  const json = await fetchAndValidate(url, { signal });

  const payload = json?.data;
  let d = {};
  if (Array.isArray(payload)) {
    d =
      payload.find((b) => b != null && String(b.book_id) === String(bookId)) ??
      payload[0] ??
      {};
  } else if (payload && typeof payload === 'object') {
    d = payload;
  }

  const result = {
    abstract: cleanAbstract(d.abstract || d.book_abstract_v2) || null,
    author: d.author || null,
    audio_thumb_uri: d.audio_thumb_uri || d.thumb_url || d.bookshelf_thumb_url || null,
    original_book_name: d.original_book_name || d.book_name || null,
    score: d.score || null,
    tags: d.tags || null,
    category: d.category || null,
    sub_info: d.sub_info || null,
    content_chapter_number: d.content_chapter_number || null,
    word_number: d.word_number || null,
    last_publish_time: d.last_publish_time || null,
    creation_status: d.creation_status || null,
  };
  
  await detailCache.set(bookId, result);
  return result;
}

export async function fetchBookDirectory(bookId, { forceRefresh = false, signal } = {}) {
  if (!forceRefresh) {
    const cached = await directoryCache.get(bookId);
    if (cached) {
      setLastReadChapter(bookId, null);
      return cached;
    }
  }

  const url = getFetchUrl('directory', { book_id: bookId });
  const options = { ...(forceRefresh && { cache: 'no-store' }), ...(signal && { signal }) };
  const json = await fetchAndValidate(url, options);

  const { lists } = json || {};
  if (!lists || lists.length === 0) {
    throw new Error('Invalid book ID or book not found');
  }
  const itemDataList = (lists || []).map((item) => ({
    item_id: item.item_id,
    title: item.title,
    version: item.version,
  }));
  
  const inner = { item_data_list: itemDataList };
  await directoryCache.set(bookId, inner);
  setLastReadChapter(bookId, null);
  
  return inner;
}

export async function fetchItem(itemId, { forceRefresh = false, signal } = {}) {
  if (!forceRefresh) {
    const cached = await chapterCache.get(itemId);
    if (cached != null) {
      return { content: cached };
    }
  }

  const url = getFetchUrl('content', { item_id: itemId });
  const json = await fetchAndValidate(url, { signal });

  const content = json?.content ?? '';
  const filteredContent = cleanText(content);
  await chapterCache.set(itemId, filteredContent);
  
  return { content: filteredContent };
}

export async function fetchComments(bookId, { count = 20, offset = 1, signal } = {}) {
  const url = getFetchUrl('comment', { book_id: bookId, count, offset });
  const json = await fetchAndValidate(url, { signal });
  return json ?? { data: { comment: [], comment_cnt: 0, context: '', has_more: false } };
}
