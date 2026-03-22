import {
  SORT_ORDER_KEY,
  READING_HISTORY_KEY,
  READING_HISTORY_MAX,
  FONT_SIZE_KEY,
  FONT_SIZE_MIN,
  FONT_SIZE_MAX,
  FONT_SIZE_DEFAULT,
  FONT_FAMILY_KEY,
  CHINESE_FONTS,
  TRADITIONAL_CHINESE_KEY,
  TEXT_BRIGHTNESS_KEY,
  TEXT_BRIGHTNESS_MIN,
  TEXT_BRIGHTNESS_MAX,
  TEXT_BRIGHTNESS_DEFAULT,
  READER_BACKGROUND_KEY,
  READER_BACKGROUND_OPTIONS,
} from './constants';
import { directoryCache, chapterCache, detailCache } from './cache';

export function safeGetItem(key) {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function safeSetItem(key, value) {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function safeGetJSON(key) {
  try {
    const raw = safeGetItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function safeSetJSON(key, value) {
  try {
    return safeSetItem(key, JSON.stringify(value));
  } catch {
    return false;
  }
}

export function safeRemoveItem(key) {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export async function deleteBookData(bookId) {
  if (!bookId) return;
  const directory = await directoryCache.get(bookId);
  const itemIds = directory?.item_data_list?.map((item) => item.item_id) ?? [];
  await directoryCache.remove(bookId);
  await detailCache.remove(bookId);
  await Promise.all(itemIds.map((itemId) => chapterCache.remove(itemId)));
  const history = getReadingHistory().filter((e) => e.bookId !== bookId);
  safeSetJSON(READING_HISTORY_KEY, history);
}

export function getReadingHistory() {
  const raw = safeGetJSON(READING_HISTORY_KEY);
  return Array.isArray(raw) ? raw : [];
}

export function getLastReadChapter(bookId) {
  if (!bookId) return null;
  const entry = getReadingHistory().find((e) => e.bookId === bookId);
  return entry ? entry.itemId : null;
}

export function setLastReadChapter(bookId, itemId) {
  if (!bookId) return false;
  const now = Date.now();
  const existing = getReadingHistory().find((e) => e.bookId === bookId);

  if (itemId != null && itemId !== '') {
    let history = getReadingHistory().filter((e) => e.bookId !== bookId);
    history.unshift({ bookId: String(bookId), itemId: String(itemId), lastReadAt: now });
    history = history.slice(0, READING_HISTORY_MAX);
    return safeSetJSON(READING_HISTORY_KEY, history);
  }
  // catalog-only: add to history only if not already present (don't overwrite chapter)
  if (existing) return true;
  let history = getReadingHistory().filter((e) => e.bookId !== bookId);
  history.unshift({ bookId: String(bookId), itemId: null, lastReadAt: now });
  history = history.slice(0, READING_HISTORY_MAX);
  return safeSetJSON(READING_HISTORY_KEY, history);
}

export function getFontSize() {
  const raw = safeGetItem(FONT_SIZE_KEY);
  if (raw == null) return FONT_SIZE_DEFAULT;
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? FONT_SIZE_DEFAULT : Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, n));
}

export function setFontSize(size) {
  const clamped = Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, size));
  return safeSetItem(FONT_SIZE_KEY, String(clamped));
}

export function getFontFamily() {
  const raw = safeGetItem(FONT_FAMILY_KEY);
  const valid = CHINESE_FONTS.some((f) => f.value === raw);
  return valid ? raw : CHINESE_FONTS[0].value;
}

export function setFontFamily(value) {
  const valid = CHINESE_FONTS.some((f) => f.value === value);
  return valid ? safeSetItem(FONT_FAMILY_KEY, value) : false;
}

export function getTextBrightness() {
  const raw = safeGetItem(TEXT_BRIGHTNESS_KEY);
  if (raw == null) return TEXT_BRIGHTNESS_DEFAULT;
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? TEXT_BRIGHTNESS_DEFAULT : Math.max(TEXT_BRIGHTNESS_MIN, Math.min(TEXT_BRIGHTNESS_MAX, n));
}

export function setTextBrightness(value) {
  const clamped = Math.max(TEXT_BRIGHTNESS_MIN, Math.min(TEXT_BRIGHTNESS_MAX, value));
  return safeSetItem(TEXT_BRIGHTNESS_KEY, String(clamped));
}

export function getReaderBackground() {
  const raw = safeGetItem(READER_BACKGROUND_KEY);
  const valid = READER_BACKGROUND_OPTIONS.some((o) => o.value === raw);
  return valid ? raw : READER_BACKGROUND_OPTIONS[0].value;
}

export function setReaderBackground(value) {
  const valid = READER_BACKGROUND_OPTIONS.some((o) => o.value === value);
  return valid ? safeSetItem(READER_BACKGROUND_KEY, value) : false;
}

/** @returns {'original'|'tw'|'hk'} Default: 'tw' */
export function getConversionMode() {
  const raw = safeGetItem(TRADITIONAL_CHINESE_KEY);
  if (raw == null) return 'tw';
  if (raw === 'original' || raw === 'tw' || raw === 'hk') return raw;
  return raw === '1' ? 'tw' : 'original'; // backward compat
}

export function setConversionMode(mode) {
  const valid = mode === 'original' || mode === 'tw' || mode === 'hk';
  return valid ? safeSetItem(TRADITIONAL_CHINESE_KEY, mode) : false;
}

/** @returns {'ascending'|'descending'} Default: 'ascending' */
export function getSortOrder() {
  const raw = safeGetItem(SORT_ORDER_KEY);
  return raw === 'descending' ? 'descending' : 'ascending';
}

export function setSortOrder(order) {
  const valid = order === 'ascending' || order === 'descending';
  return valid ? safeSetItem(SORT_ORDER_KEY, order) : false;
}

export async function isChapterCached(itemId) {
  if (!itemId) return false;
  const raw = await chapterCache.get(itemId);
  return raw != null;
}

export async function deleteChapter(itemId) {
  if (!itemId) return false;
  await chapterCache.remove(itemId);
  return true;
}

