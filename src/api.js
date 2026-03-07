import { API_BASE_KEY, DIRECTORY_CACHE_KEY, CHAPTER_CACHE_KEY, DETAIL_CACHE_KEY, REQUEST_TIMEOUT_MS } from './utils/constants';
import { safeGetItem, safeSetItem, setLastReadChapter } from './utils/storage';
import { createCacheHelpers } from './utils/cache';
import { maybeConvert } from './utils/zh-convert';

export const API_OPTIONS = [
  { id: 'bk', url: 'https://bk.yydjtc.cn', label: 'bk.yydjtc.cn' },
  { id: 'qkfq', url: 'https://qkfqapi.vv9v.cn', label: 'qkfqapi.vv9v.cn' },
];

const DEFAULT_API_BASE = API_OPTIONS[0].url;

export function getApiBase() {
  return safeGetItem(API_BASE_KEY) || DEFAULT_API_BASE;
}

export function setApiBase(url) {
  safeSetItem(API_BASE_KEY, url);
}

async function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs / 1000}s`);
    }
    throw err;
  }
}

async function fetchAndValidate(url, options = {}) {
  const res = await fetchWithTimeout(url, options);
  if (!res.ok) throw new Error('Failed to fetch data');
  const json = await res.json();
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

const directoryCache = createCacheHelpers(DIRECTORY_CACHE_KEY);
const chapterCache = createCacheHelpers(CHAPTER_CACHE_KEY);
const detailCache = createCacheHelpers(DETAIL_CACHE_KEY);

export async function fetchBookDetail(bookId, { forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = detailCache.get(bookId);
    if (cached) return cached;
  }

  const url = `${getApiBase()}/api/detail?book_id=${bookId}`;
  const json = await fetchAndValidate(url);
  
  const d = json.data?.data ?? {};
  const result = {
    abstract: d.abstract || null,
    author: d.author || null,
    thumb_url: d.thumb_url || null,
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
  
  detailCache.set(bookId, result);
  return result;
}

export async function fetchBookDirectory(bookId, { forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = directoryCache.get(bookId);
    if (cached) {
      setLastReadChapter(bookId, null);
      return { data: { data: { data: cached } } };
    }
  }

  const url = `${getApiBase()}/api/directory?book_id=${bookId}`;
  const options = forceRefresh ? { cache: 'no-store' } : {};
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
  directoryCache.set(bookId, inner);
  setLastReadChapter(bookId, null);
  
  return { data: { data: { data: inner } } };
}

async function applyChapterConversion(result) {
  const content = result?.data?.data?.content ?? '';
  const converted = maybeConvert(content);
  return {
    ...result,
    data: {
      ...result.data,
      data: {
        ...result.data?.data,
        content: converted,
      },
    },
  };
}

export async function fetchItem(itemId, { forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = chapterCache.get(itemId);
    if (cached != null) {
      const result = { data: { data: { content: cached, novel_data: null } } };
      return applyChapterConversion(result);
    }
  }

  const url = `${getApiBase()}/api/content?tab=小说&item_id=${itemId}`;
  const json = await fetchAndValidate(url);
  
  const content = json.data?.content ?? '';
  const filteredContent = stripHtmlTagsAndNewlines(content);
  chapterCache.set(itemId, filteredContent);
  
  const result = {
    data: {
      data: {
        content: filteredContent,
        novel_data: null,
      },
    },
  };
  
  return applyChapterConversion(result);
}

export async function fetchComments(bookId, { count = 20, offset = 1 } = {}) {
  const url = `${getApiBase()}/api/comment?book_id=${bookId}&count=${count}&offset=${offset}`;
  const json = await fetchAndValidate(url);
  return json.data ?? { data: { comment: [], comment_cnt: 0, context: '', has_more: false } };
}
