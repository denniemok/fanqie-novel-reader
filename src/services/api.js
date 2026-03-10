import { API_BASE_KEY, API_OPTIONS, REQUEST_TIMEOUT_MS } from '../utils/constants';
import { safeGetItem, safeSetItem, setLastReadChapter } from '../utils/storage';
import { directoryCache, chapterCache, detailCache } from '../utils/cache';

const DEFAULT_API_BASE = API_OPTIONS[0].value;

export function getApiBase() {
  return safeGetItem(API_BASE_KEY) || DEFAULT_API_BASE;
}

export function setApiBase(url) {
  safeSetItem(API_BASE_KEY, url);
}

async function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
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
    const res = await fetch(url, { ...options, signal: controller.signal });
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
  const res = await fetchWithTimeout(url, options);
  if (!res.ok) throw new Error('Failed to fetch data');
  let json;
  try {
    json = await res.json();
  } catch (parseErr) {
    throw new Error('Invalid response from server');
  }
  if (json.code !== 200) throw new Error('Failed to fetch data');
  return json;
}

function stripHtmlTagsAndNewlines(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  let filteredText = (doc.body.textContent || '')
    .replace(/\n+/g, '\n')
    .replace(/\n\s*\n/g, '\n');
  if (filteredText.startsWith('\n')) filteredText = filteredText.substring(1);
  if (!filteredText.endsWith('\n')) filteredText += '\n';
  return filteredText;
}

export async function fetchBookDetail(bookId, { forceRefresh = false, signal } = {}) {
  if (!forceRefresh) {
    const cached = await detailCache.get(bookId);
    if (cached) return cached;
  }

  const url = `${getApiBase()}/api/detail?book_id=${bookId}`;
  const json = await fetchAndValidate(url, { signal });
  
  const d = json.data?.data ?? {};
  const result = {
    abstract: d.abstract || null,
    author: d.author || null,
    audio_thumb_uri: d.audio_thumb_uri || null,
    original_book_name: d.original_book_name || null,
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
      return { data: { data: { data: cached } } };
    }
  }

  const url = `${getApiBase()}/api/directory?book_id=${bookId}`;
  const options = { ...(forceRefresh && { cache: 'no-store' }), ...(signal && { signal }) };
  const json = await fetchAndValidate(url, options);
  
  const { lists } = json.data || {};
  if (!lists || lists.length === 0) {
    throw new Error('Invalid book ID or book not found');
  }
  const itemDataList = (lists || []).map((item) => ({
    item_id: item.item_id,
    title: item.title,
    version: item.version,
    chapter_word_number: item.chapter_word_number ?? null,
  }));
  
  const inner = { book_info: {}, item_data_list: itemDataList };
  await directoryCache.set(bookId, inner);
  setLastReadChapter(bookId, null);
  
  return { data: { data: { data: inner } } };
}

export async function fetchItem(itemId, { forceRefresh = false, signal } = {}) {
  if (!forceRefresh) {
    const cached = await chapterCache.get(itemId);
    if (cached != null) {
      return { data: { data: { content: cached, novel_data: null } } };
    }
  }

  const url = `${getApiBase()}/api/content?tab=小说&item_id=${itemId}`;
  const json = await fetchAndValidate(url, { signal });
  
  const content = json.data?.content ?? '';
  const filteredContent = stripHtmlTagsAndNewlines(content);
  await chapterCache.set(itemId, filteredContent);
  
  return {
    data: {
      data: {
        content: filteredContent,
        novel_data: null,
      },
    },
  };
}

export async function fetchComments(bookId, { count = 20, offset = 1, signal } = {}) {
  const url = `${getApiBase()}/api/comment?book_id=${bookId}&count=${count}&offset=${offset}`;
  const json = await fetchAndValidate(url, { signal });
  return json.data ?? { data: { comment: [], comment_cnt: 0, context: '', has_more: false } };
}
