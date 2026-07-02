import {
  CATALOG_SORT_DIRECTION_KEY,
  CATALOG_MANAGE_MODE_KEY,
  READING_HISTORY_KEY,
  READING_HISTORY_LEGACY_KEY,
  COLLECTIONS_KEY,
  BOOKSHELF_VIEW_MODE_KEY,
  DISCOVER_VIEW_MODE_KEY,
  BOOKSHELF_SORT_KEY,
  BOOKSHELF_SORT_DIRECTION_KEY,
  DISCOVER_SORT_KEY,
  DISCOVER_SORT_DIRECTION_KEY,
  BOOKSHELF_ACTIVE_TAB_KEY,
  DISCOVER_ACTIVE_TAB_KEY,
  BOOKSHELF_FILTERS_KEY,
  DISCOVER_FILTERS_KEY,
  FONT_SIZE_KEY,
  FONT_SIZE_MIN,
  FONT_SIZE_MAX,
  FONT_SIZE_DEFAULT,
  FONT_FAMILY_KEY,
  CHINESE_FONTS,
  TRADITIONAL_CHINESE_KEY,
  BOOK_DISPLAY_VARIANT_KEY,
  TEXT_BRIGHTNESS_KEY,
  TEXT_BRIGHTNESS_MIN,
  TEXT_BRIGHTNESS_MAX,
  TEXT_BRIGHTNESS_DEFAULT,
  READER_BACKGROUND_KEY,
  READER_BACKGROUND_OPTIONS,
  THEME_KEY,
} from './constants';
import { normalizeBookFilterState } from './book/bookFilters';
import { directoryCache, chapterCache, detailCache, getStoreItem, setStoreItem } from './cache';

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

export async function deleteBooksData(bookIds) {
  const bids = [...new Set((Array.isArray(bookIds) ? bookIds : [bookIds]).map(String).filter(Boolean))];
  if (!bids.length) return;

  const itemIdsToRemove = [];
  await Promise.all(
    bids.map(async (bookId) => {
      const directory = await directoryCache.get(bookId);
      const itemIds = directory?.item_data_list?.map((item) => item.item_id) ?? [];
      itemIdsToRemove.push(...itemIds);
      await directoryCache.remove(bookId);
      await detailCache.remove(bookId);
    })
  );
  await Promise.all(itemIdsToRemove.map((itemId) => chapterCache.remove(itemId)));

  const bidSet = new Set(bids);
  const history = (await getReadingHistory()).filter((e) => !bidSet.has(e.bookId));
  await saveReadingHistory(history);
  const collections = (await getCollections()).map((c) => ({
    ...c,
    bookIds: c.bookIds.filter((id) => !bidSet.has(id)),
  }));
  await saveCollections(collections);
}

async function migrateReadingHistoryFromLocalStorage() {
  const legacy = safeGetJSON(READING_HISTORY_LEGACY_KEY);
  if (!Array.isArray(legacy)) return null;
  await setStoreItem(READING_HISTORY_KEY, legacy);
  safeRemoveItem(READING_HISTORY_LEGACY_KEY);
  return legacy;
}

async function saveReadingHistory(history) {
  return setStoreItem(READING_HISTORY_KEY, history);
}

export async function getReadingHistory() {
  const fromIdb = await getStoreItem(READING_HISTORY_KEY);
  if (Array.isArray(fromIdb)) return fromIdb;
  const migrated = await migrateReadingHistoryFromLocalStorage();
  if (Array.isArray(migrated)) return migrated;
  await saveReadingHistory([]);
  return [];
}

export async function getLastReadChapter(bookId) {
  if (!bookId) return null;
  const bid = String(bookId);
  const history = await getReadingHistory();
  const entry = history.find((e) => e.bookId === bid);
  return entry ? entry.itemId : null;
}

export async function setLastReadChapter(bookId, itemId) {
  if (!bookId) return false;
  const now = Date.now();
  const bid = String(bookId);
  const history = (await getReadingHistory()).map((e) => ({ ...e }));
  const existingIndex = history.findIndex((e) => e.bookId === bid);
  const existing = existingIndex >= 0 ? history[existingIndex] : null;

  if (itemId != null && itemId !== '') {
    const itemIdStr = String(itemId);
    if (existingIndex >= 0) {
      history[existingIndex] = {
        ...history[existingIndex],
        itemId: itemIdStr,
        lastReadAt: now,
      };
    } else {
      history.unshift({ bookId: bid, itemId: itemIdStr, lastReadAt: now });
    }
    return saveReadingHistory(history);
  }
  if (existing) return true;
  history.unshift({ bookId: bid, itemId: null, lastReadAt: now });
  return saveReadingHistory(history);
}

/** Add books to reading history (「全部」) without requiring a chapter read. */
export async function addBooksToReadingHistory(bookIds) {
  const bids = [...new Set((Array.isArray(bookIds) ? bookIds : [bookIds]).map(String).filter(Boolean))];
  if (!bids.length) return false;
  const history = (await getReadingHistory()).map((e) => ({ ...e }));
  const now = Date.now();
  for (const bid of bids) {
    const idx = history.findIndex((e) => e.bookId === bid);
    if (idx >= 0) {
      history[idx] = { ...history[idx], lastReadAt: now };
    } else {
      history.unshift({ bookId: bid, itemId: null, lastReadAt: now });
    }
  }
  return saveReadingHistory(history);
}

/** Remove books from reading history only; cached data is kept. */
export async function removeBooksFromReadingHistory(bookIds) {
  const bidSet = new Set((Array.isArray(bookIds) ? bookIds : [bookIds]).map(String).filter(Boolean));
  if (!bidSet.size) return false;
  const history = (await getReadingHistory()).filter((e) => !bidSet.has(e.bookId));
  return saveReadingHistory(history);
}

/** Move entry from one index to another; order is user-controlled, not time-based. */
export async function reorderReadingHistory(fromIndex, toIndex) {
  const history = (await getReadingHistory()).map((e) => ({ ...e }));
  if (fromIndex < 0 || fromIndex >= history.length || toIndex < 0 || toIndex >= history.length) {
    return false;
  }
  if (fromIndex === toIndex) return true;
  const [item] = history.splice(fromIndex, 1);
  history.splice(toIndex, 0, item);
  return saveReadingHistory(history);
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
  return 'tw';
}

export function setConversionMode(mode) {
  const valid = mode === 'original' || mode === 'tw' || mode === 'hk';
  return valid ? safeSetItem(TRADITIONAL_CHINESE_KEY, mode) : false;
}

/** @returns {'new'|'old'} Default: 'new' */
export function getBookDisplayVariant() {
  const raw = safeGetItem(BOOK_DISPLAY_VARIANT_KEY);
  return raw === 'old' ? 'old' : 'new';
}

export function setBookDisplayVariant(variant) {
  const valid = variant === 'new' || variant === 'old';
  return valid ? safeSetItem(BOOK_DISPLAY_VARIANT_KEY, variant) : false;
}

/** @returns {'ascending'|'descending'} Default: 'ascending' */
export function getCatalogSortDirection() {
  const raw = safeGetItem(CATALOG_SORT_DIRECTION_KEY);
  return raw === 'descending' ? 'descending' : 'ascending';
}

export function setCatalogSortDirection(direction) {
  const valid = direction === 'ascending' || direction === 'descending';
  return valid ? safeSetItem(CATALOG_SORT_DIRECTION_KEY, direction) : false;
}

/** @returns {boolean} Default: true */
export function getCatalogManageMode() {
  const raw = safeGetItem(CATALOG_MANAGE_MODE_KEY);
  if (raw === 'false') return false;
  return true;
}

export function setCatalogManageMode(enabled) {
  return safeSetItem(CATALOG_MANAGE_MODE_KEY, enabled ? 'true' : 'false');
}

export async function isChapterCached(itemId) {
  if (!itemId) return false;
  const raw = await chapterCache.get(itemId);
  return raw != null;
}

export async function getUncachedItemIds(itemIds) {
  const results = await Promise.all(
    itemIds.map((id) => isChapterCached(id).then((cached) => ({ id, cached })))
  );
  return results.filter((r) => !r.cached).map((r) => r.id);
}

export async function deleteChapter(itemId) {
  if (!itemId) return false;
  await chapterCache.remove(itemId);
  return true;
}

// ── Collections ──────────────────────────────────────────────────────────────

export async function getCollections() {
  const fromIdb = await getStoreItem(COLLECTIONS_KEY);
  if (Array.isArray(fromIdb)) return fromIdb;
  await saveCollections([]);
  return [];
}

export async function saveCollections(collections) {
  return setStoreItem(COLLECTIONS_KEY, collections);
}

export async function createCollection(name) {
  if (!name?.trim()) return null;
  const collections = await getCollections();
  const newCollection = { id: `col_${Date.now()}`, name: name.trim(), bookIds: [] };
  collections.push(newCollection);
  await saveCollections(collections);
  return newCollection;
}

export async function deleteCollection(collectionId) {
  const collections = (await getCollections()).filter((c) => c.id !== collectionId);
  return saveCollections(collections);
}

export async function reorderCollections(fromIndex, toIndex) {
  const collections = await getCollections();
  if (
    fromIndex < 0
    || fromIndex >= collections.length
    || toIndex < 0
    || toIndex >= collections.length
  ) {
    return false;
  }
  if (fromIndex === toIndex) return true;
  const next = [...collections];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return saveCollections(next);
}

export async function renameCollection(collectionId, name) {
  if (!name?.trim()) return false;
  const collections = (await getCollections()).map((c) =>
    c.id === collectionId ? { ...c, name: name.trim() } : c
  );
  return saveCollections(collections);
}

export async function addBooksToCollection(collectionId, bookIds) {
  const bids = [...new Set((Array.isArray(bookIds) ? bookIds : [bookIds]).map(String).filter(Boolean))];
  if (!bids.length) return false;
  const collections = await getCollections();
  const updated = collections.map((c) => {
    if (c.id !== collectionId) return c;
    const next = [...c.bookIds];
    for (const bid of bids) {
      if (!next.includes(bid)) next.push(bid);
    }
    return { ...c, bookIds: next };
  });
  return saveCollections(updated);
}

export async function removeBooksFromCollection(collectionId, bookIds) {
  const bidSet = new Set((Array.isArray(bookIds) ? bookIds : [bookIds]).map(String).filter(Boolean));
  if (!bidSet.size) return false;
  const collections = (await getCollections()).map((c) =>
    c.id === collectionId
      ? { ...c, bookIds: c.bookIds.filter((id) => !bidSet.has(id)) }
      : c
  );
  return saveCollections(collections);
}

/** Move a book within a collection's bookIds; order is user-controlled. */
export async function reorderCollectionBooks(collectionId, fromIndex, toIndex) {
  const collections = await getCollections();
  const col = collections.find((c) => c.id === collectionId);
  if (!col) return false;
  const bookIds = [...col.bookIds];
  if (fromIndex < 0 || fromIndex >= bookIds.length || toIndex < 0 || toIndex >= bookIds.length) {
    return false;
  }
  if (fromIndex === toIndex) return true;
  const [item] = bookIds.splice(fromIndex, 1);
  bookIds.splice(toIndex, 0, item);
  return saveCollections(
    collections.map((c) => (c.id === collectionId ? { ...c, bookIds } : c))
  );
}

// ── Bookshelf view mode ───────────────────────────────────────────────────────

function getViewMode(key) {
  const raw = safeGetItem(key);
  return raw === 'grid' ? 'grid' : 'list';
}

function setViewMode(key, mode) {
  const valid = mode === 'list' || mode === 'grid';
  return valid ? safeSetItem(key, mode) : false;
}

export function getBookshelfViewMode() {
  return getViewMode(BOOKSHELF_VIEW_MODE_KEY);
}

export function setBookshelfViewMode(mode) {
  return setViewMode(BOOKSHELF_VIEW_MODE_KEY, mode);
}

export function getDiscoverViewMode() {
  return getViewMode(DISCOVER_VIEW_MODE_KEY);
}

export function setDiscoverViewMode(mode) {
  return setViewMode(DISCOVER_VIEW_MODE_KEY, mode);
}

/** @returns {'manual'|'rating'|'update'|'chapters'|'words'} */
export function getBookshelfSort() {
  const raw = safeGetItem(BOOKSHELF_SORT_KEY);
  const valid = ['manual', 'rating', 'update', 'chapters', 'words'];
  return valid.includes(raw) ? raw : 'manual';
}

export function setBookshelfSort(sort) {
  const valid = ['manual', 'rating', 'update', 'chapters', 'words'];
  return valid.includes(sort) ? safeSetItem(BOOKSHELF_SORT_KEY, sort) : false;
}

/** @returns {'asc'|'desc'} */
export function getBookshelfSortDirection() {
  const raw = safeGetItem(BOOKSHELF_SORT_DIRECTION_KEY);
  return raw === 'asc' ? 'asc' : 'desc';
}

export function setBookshelfSortDirection(direction) {
  const valid = direction === 'asc' || direction === 'desc';
  return valid ? safeSetItem(BOOKSHELF_SORT_DIRECTION_KEY, direction) : false;
}

const DISCOVER_SORT_VALUES = ['default', 'rating', 'update', 'words'];

/** @returns {'default'|'rating'|'update'|'words'} */
export function getDiscoverSort() {
  const raw = safeGetItem(DISCOVER_SORT_KEY);
  return DISCOVER_SORT_VALUES.includes(raw) ? raw : 'default';
}

export function setDiscoverSort(sort) {
  return DISCOVER_SORT_VALUES.includes(sort) ? safeSetItem(DISCOVER_SORT_KEY, sort) : false;
}

/** @returns {'asc'|'desc'} */
export function getDiscoverSortDirection() {
  const raw = safeGetItem(DISCOVER_SORT_DIRECTION_KEY);
  return raw === 'asc' ? 'asc' : 'desc';
}

export function setDiscoverSortDirection(direction) {
  const valid = direction === 'asc' || direction === 'desc';
  return valid ? safeSetItem(DISCOVER_SORT_DIRECTION_KEY, direction) : false;
}

export function getBookshelfActiveTab() {
  const raw = safeGetItem(BOOKSHELF_ACTIVE_TAB_KEY);
  if (!raw || raw === 'all') return 'all';
  return raw;
}

export function setBookshelfActiveTab(tabId) {
  if (tabId === 'all') return safeSetItem(BOOKSHELF_ACTIVE_TAB_KEY, 'all');
  if (typeof tabId === 'string' && tabId.trim()) {
    return safeSetItem(BOOKSHELF_ACTIVE_TAB_KEY, tabId);
  }
  return false;
}

const DISCOVER_PRIMARY_TABS = new Set(['search', 'rank', 'recommend', 'others']);
const DISCOVER_DEFAULT_SECONDARY = {
  rank: 'recommend',
  recommend: 'realtime',
};
const DISCOVER_SECONDARY_TABS = {
  rank: new Set(['recommend', 'finished', 'new', 'chasing', 'darkhorse', 'peak', 'reading']),
  recommend: new Set(['realtime', 'guess']),
};

export function getDiscoverActiveTab() {
  const raw = safeGetJSON(DISCOVER_ACTIVE_TAB_KEY);
  const primary = DISCOVER_PRIMARY_TABS.has(raw?.primary) ? raw.primary : 'search';
  const secondaryTabs = DISCOVER_SECONDARY_TABS[primary];
  if (!secondaryTabs) {
    return { primary, secondary: null };
  }
  const secondary = secondaryTabs.has(raw?.secondary)
    ? raw.secondary
    : DISCOVER_DEFAULT_SECONDARY[primary];
  return { primary, secondary };
}

export function setDiscoverActiveTab({ primary, secondary = null }) {
  if (!DISCOVER_PRIMARY_TABS.has(primary)) return false;
  const payload = { primary, secondary };
  if (DISCOVER_SECONDARY_TABS[primary]) {
    if (!DISCOVER_SECONDARY_TABS[primary].has(secondary)) {
      payload.secondary = DISCOVER_DEFAULT_SECONDARY[primary];
    }
  } else {
    payload.secondary = null;
  }
  return safeSetJSON(DISCOVER_ACTIVE_TAB_KEY, payload);
}

function getBookFilterState(key) {
  return normalizeBookFilterState(safeGetJSON(key));
}

function setBookFilterState(key, { filters, expanded }) {
  const current = getBookFilterState(key);
  const next = normalizeBookFilterState({
    filters: filters ?? current.filters,
    expanded: expanded ?? current.expanded,
  });
  return safeSetJSON(key, next);
}

export function getBookshelfFilterState() {
  return getBookFilterState(BOOKSHELF_FILTERS_KEY);
}

export function setBookshelfFilterState(state) {
  return setBookFilterState(BOOKSHELF_FILTERS_KEY, state);
}

export function getDiscoverFilterState() {
  return getBookFilterState(DISCOVER_FILTERS_KEY);
}

export function setDiscoverFilterState(state) {
  return setBookFilterState(DISCOVER_FILTERS_KEY, state);
}

/** @returns {'light'|'dark'} */
export function getTheme() {
  return safeGetItem(THEME_KEY) === 'light' ? 'light' : 'dark';
}

export function setTheme(theme) {
  if (theme !== 'light' && theme !== 'dark') return false;
  return safeSetItem(THEME_KEY, theme);
}

