import {
  CATALOG_SORT_DIRECTION_KEY,
  CATALOG_MANAGE_MODE_KEY,
  READING_HISTORY_KEY,
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
  UI_FONT_MODE_KEY,
  UI_FONT_MODE_BRAND,
  UI_FONT_MODE_FOLLOW,
  CHINESE_FONTS,
  TRADITIONAL_CHINESE_KEY,
  BOOK_DISPLAY_VARIANT_KEY,
  BOOKSHELF_QUICK_ACTION_KEY,
  TEXT_BRIGHTNESS_KEY,
  TEXT_BRIGHTNESS_MIN,
  TEXT_BRIGHTNESS_MAX,
  TEXT_BRIGHTNESS_DEFAULT,
  READER_BACKGROUND_KEY,
  READER_BACKGROUND_OPTIONS,
  READER_CUSTOM_BG_KEY,
  READER_CUSTOM_TEXT_KEY,
  READER_CUSTOM_BG_DEFAULT,
  READER_CUSTOM_TEXT_DEFAULT,
  THEME_KEY,
} from './constants';
import { isValidHexColor, isValidReaderBackground } from './readerColors';
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

function normalizeBookIds(bookIds) {
  return [...new Set((Array.isArray(bookIds) ? bookIds : [bookIds]).map(String).filter(Boolean))];
}

function readStoredChoice(key, allowed, fallback) {
  const raw = safeGetItem(key);
  return allowed.includes(raw) ? raw : fallback;
}

function writeStoredChoice(key, value, allowed) {
  return allowed.includes(value) ? safeSetItem(key, value) : false;
}

function readStoredInt(key, { min, max, fallback }) {
  const raw = safeGetItem(key);
  if (raw == null) return fallback;
  const n = parseInt(raw, 10);
  return Number.isNaN(n) ? fallback : Math.max(min, Math.min(max, n));
}

function writeStoredInt(key, value, { min, max }) {
  const clamped = Math.max(min, Math.min(max, value));
  return safeSetItem(key, String(clamped));
}

function readStoredBool(key, fallback) {
  const raw = safeGetItem(key);
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  return fallback;
}

function writeStoredBool(key, enabled) {
  return safeSetItem(key, enabled ? 'true' : 'false');
}

// ── Bookshelf write serialiser ────────────────────────────────────────────────
// All mutations to the reading-history and collections documents run through a
// single promise chain so concurrent read-modify-write calls never race.
const _bookshelfWriteQueue = { tail: Promise.resolve() };

function serialiseBookshelfWrite(fn) {
  // Chain onto the previous tail. Pass fn as both the fulfillment and rejection
  // handler so the queue keeps moving even if a prior write threw.
  const next = _bookshelfWriteQueue.tail.then(fn, fn);
  // Store a silent version as the new tail so future callers don't inherit errors.
  _bookshelfWriteQueue.tail = next.then(() => {}, () => {});
  return next;
}

/** @returns {Array|null} The same list when indexes match, a reordered copy when they differ, or null when out of range. */
function reorderItems(list, fromIndex, toIndex) {
  if (
    fromIndex < 0
    || toIndex < 0
    || fromIndex >= list.length
    || toIndex >= list.length
  ) {
    return null;
  }
  if (fromIndex === toIndex) return list;
  const next = list.slice();
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

export async function deleteBooksData(bookIds) {
  const bids = normalizeBookIds(bookIds);
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

  return serialiseBookshelfWrite(async () => {
    const bidSet = new Set(bids);
    const history = (await getReadingHistory()).filter((e) => !bidSet.has(e.bookId));
    await saveReadingHistory(history);
    const collections = (await getCollections()).map((c) => ({
      ...c,
      bookIds: c.bookIds.filter((id) => !bidSet.has(id)),
    }));
    await saveCollections(collections);
  });
}

async function saveReadingHistory(history) {
  return setStoreItem(READING_HISTORY_KEY, history);
}

export async function getReadingHistory() {
  const fromIdb = await getStoreItem(READING_HISTORY_KEY);
  // Return [] without auto-saving when the value isn't an array (e.g. first
  // visit, or a corrupt/malformed import). The next write will persist the
  // correct state; auto-saving here would race with concurrent mutators.
  return Array.isArray(fromIdb) ? fromIdb : [];
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
  return serialiseBookshelfWrite(async () => {
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
  });
}

/** Add books to reading history (「全部」) without requiring a chapter read. */
export async function addBooksToReadingHistory(bookIds) {
  const bids = normalizeBookIds(bookIds);
  if (!bids.length) return false;
  return serialiseBookshelfWrite(async () => {
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
  });
}

/** Remove books from reading history only; cached data is kept. */
export async function removeBooksFromReadingHistory(bookIds) {
  const bidSet = new Set(normalizeBookIds(bookIds));
  if (!bidSet.size) return false;
  return serialiseBookshelfWrite(async () => {
    const history = (await getReadingHistory()).filter((e) => !bidSet.has(e.bookId));
    return saveReadingHistory(history);
  });
}

/** Move entry from one index to another; order is user-controlled, not time-based. */
export async function reorderReadingHistory(fromIndex, toIndex) {
  return serialiseBookshelfWrite(async () => {
    const history = (await getReadingHistory()).map((e) => ({ ...e }));
    const next = reorderItems(history, fromIndex, toIndex);
    if (!next) return false;
    if (next === history) return true;
    return saveReadingHistory(next);
  });
}

const FONT_FAMILY_VALUES = CHINESE_FONTS.map((font) => font.value);
const UI_FONT_MODE_VALUES = [UI_FONT_MODE_BRAND, UI_FONT_MODE_FOLLOW, ...FONT_FAMILY_VALUES];
const FONT_SIZE_RANGE = { min: FONT_SIZE_MIN, max: FONT_SIZE_MAX, fallback: FONT_SIZE_DEFAULT };
const TEXT_BRIGHTNESS_RANGE = {
  min: TEXT_BRIGHTNESS_MIN,
  max: TEXT_BRIGHTNESS_MAX,
  fallback: TEXT_BRIGHTNESS_DEFAULT,
};

export function getFontSize() {
  return readStoredInt(FONT_SIZE_KEY, FONT_SIZE_RANGE);
}

export function setFontSize(size) {
  return writeStoredInt(FONT_SIZE_KEY, size, FONT_SIZE_RANGE);
}

export function getFontFamily() {
  return readStoredChoice(FONT_FAMILY_KEY, FONT_FAMILY_VALUES, FONT_FAMILY_VALUES[0]);
}

export function setFontFamily(value) {
  return writeStoredChoice(FONT_FAMILY_KEY, value, FONT_FAMILY_VALUES);
}

export function getUiFontMode() {
  return readStoredChoice(UI_FONT_MODE_KEY, UI_FONT_MODE_VALUES, UI_FONT_MODE_BRAND);
}

export function setUiFontMode(value) {
  return writeStoredChoice(UI_FONT_MODE_KEY, value, UI_FONT_MODE_VALUES);
}

export function getTextBrightness() {
  return readStoredInt(TEXT_BRIGHTNESS_KEY, TEXT_BRIGHTNESS_RANGE);
}

export function setTextBrightness(value) {
  return writeStoredInt(TEXT_BRIGHTNESS_KEY, value, TEXT_BRIGHTNESS_RANGE);
}

export function getReaderBackground() {
  const raw = safeGetItem(READER_BACKGROUND_KEY);
  return isValidReaderBackground(raw) ? raw : READER_BACKGROUND_OPTIONS[0].value;
}

export function setReaderBackground(value) {
  return isValidReaderBackground(value) ? safeSetItem(READER_BACKGROUND_KEY, value) : false;
}

export function getReaderCustomColors() {
  const rawBg = safeGetItem(READER_CUSTOM_BG_KEY);
  const rawText = safeGetItem(READER_CUSTOM_TEXT_KEY);
  return {
    bg: isValidHexColor(rawBg) ? rawBg : READER_CUSTOM_BG_DEFAULT,
    text: isValidHexColor(rawText) ? rawText : READER_CUSTOM_TEXT_DEFAULT,
  };
}

export function setReaderCustomColors({ bg, text }) {
  let ok = true;
  if (bg != null) ok = isValidHexColor(bg) && safeSetItem(READER_CUSTOM_BG_KEY, bg) && ok;
  if (text != null) ok = isValidHexColor(text) && safeSetItem(READER_CUSTOM_TEXT_KEY, text) && ok;
  return ok;
}

const CONVERSION_MODES = ['original', 'tw', 'hk'];
const BOOK_DISPLAY_VARIANTS = ['new', 'old'];
const CATALOG_SORT_DIRECTIONS = ['ascending', 'descending'];

/** @returns {'original'|'tw'|'hk'} Default: 'tw' */
export function getConversionMode() {
  return readStoredChoice(TRADITIONAL_CHINESE_KEY, CONVERSION_MODES, 'tw');
}

export function setConversionMode(mode) {
  return writeStoredChoice(TRADITIONAL_CHINESE_KEY, mode, CONVERSION_MODES);
}

/** @returns {'new'|'old'} Default: 'new' */
export function getBookDisplayVariant() {
  return readStoredChoice(BOOK_DISPLAY_VARIANT_KEY, BOOK_DISPLAY_VARIANTS, 'new');
}

export function setBookDisplayVariant(variant) {
  return writeStoredChoice(BOOK_DISPLAY_VARIANT_KEY, variant, BOOK_DISPLAY_VARIANTS);
}

/** @returns {'ascending'|'descending'} Default: 'ascending' */
export function getCatalogSortDirection() {
  return readStoredChoice(CATALOG_SORT_DIRECTION_KEY, CATALOG_SORT_DIRECTIONS, 'ascending');
}

export function setCatalogSortDirection(direction) {
  return writeStoredChoice(CATALOG_SORT_DIRECTION_KEY, direction, CATALOG_SORT_DIRECTIONS);
}

/** @returns {boolean} Default: true */
export function getCatalogManageMode() {
  return readStoredBool(CATALOG_MANAGE_MODE_KEY, true);
}

export function setCatalogManageMode(enabled) {
  return writeStoredBool(CATALOG_MANAGE_MODE_KEY, enabled);
}

/** @returns {boolean} Default: false */
export function getBookshelfQuickAction() {
  return readStoredBool(BOOKSHELF_QUICK_ACTION_KEY, false);
}

export function setBookshelfQuickAction(enabled) {
  return writeStoredBool(BOOKSHELF_QUICK_ACTION_KEY, enabled);
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
  return Array.isArray(fromIdb) ? fromIdb : [];
}

export async function saveCollections(collections) {
  return setStoreItem(COLLECTIONS_KEY, collections);
}

export async function createCollection(name) {
  if (!name?.trim()) return null;
  return serialiseBookshelfWrite(async () => {
    const collections = await getCollections();
    const newCollection = { id: `col_${Date.now()}`, name: name.trim(), bookIds: [] };
    collections.push(newCollection);
    await saveCollections(collections);
    return newCollection;
  });
}

export async function deleteCollection(collectionId) {
  return serialiseBookshelfWrite(async () => {
    const collections = (await getCollections()).filter((c) => c.id !== collectionId);
    return saveCollections(collections);
  });
}

export async function reorderCollections(fromIndex, toIndex) {
  return serialiseBookshelfWrite(async () => {
    const collections = await getCollections();
    const next = reorderItems(collections, fromIndex, toIndex);
    if (!next) return false;
    if (next === collections) return true;
    return saveCollections(next);
  });
}

export async function renameCollection(collectionId, name) {
  if (!name?.trim()) return false;
  return serialiseBookshelfWrite(async () => {
    const collections = (await getCollections()).map((c) =>
      c.id === collectionId ? { ...c, name: name.trim() } : c
    );
    return saveCollections(collections);
  });
}

export async function addBooksToCollection(collectionId, bookIds) {
  const bids = normalizeBookIds(bookIds);
  if (!bids.length) return false;
  return serialiseBookshelfWrite(async () => {
    const collections = await getCollections();
    const updated = collections.map((c) => {
      if (c.id !== collectionId) return c;
      const next = [...c.bookIds];
      for (const bid of bids) {
        if (!next.includes(bid)) next.unshift(bid);
      }
      return { ...c, bookIds: next };
    });
    return saveCollections(updated);
  });
}

export async function removeBooksFromCollection(collectionId, bookIds) {
  const bidSet = new Set(normalizeBookIds(bookIds));
  if (!bidSet.size) return false;
  return serialiseBookshelfWrite(async () => {
    const collections = (await getCollections()).map((c) =>
      c.id === collectionId
        ? { ...c, bookIds: c.bookIds.filter((id) => !bidSet.has(id)) }
        : c
    );
    return saveCollections(collections);
  });
}

/** Move a book within a collection's bookIds; order is user-controlled. */
export async function reorderCollectionBooks(collectionId, fromIndex, toIndex) {
  return serialiseBookshelfWrite(async () => {
    const collections = await getCollections();
    const col = collections.find((c) => c.id === collectionId);
    if (!col) return false;
    const nextBookIds = reorderItems(col.bookIds, fromIndex, toIndex);
    if (!nextBookIds) return false;
    if (nextBookIds === col.bookIds) return true;
    return saveCollections(
      collections.map((c) => (c.id === collectionId ? { ...c, bookIds: nextBookIds } : c))
    );
  });
}

// ── Bookshelf view mode ───────────────────────────────────────────────────────

const VIEW_MODES = ['list', 'grid'];

function getViewMode(key) {
  return readStoredChoice(key, VIEW_MODES, 'list');
}

function setViewMode(key, mode) {
  return writeStoredChoice(key, mode, VIEW_MODES);
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

const BOOKSHELF_SORT_VALUES = ['manual', 'rating', 'update', 'chapters', 'words'];
const SORT_DIRECTIONS = ['asc', 'desc'];

/** @returns {'manual'|'rating'|'update'|'chapters'|'words'} */
export function getBookshelfSort() {
  return readStoredChoice(BOOKSHELF_SORT_KEY, BOOKSHELF_SORT_VALUES, 'manual');
}

export function setBookshelfSort(sort) {
  return writeStoredChoice(BOOKSHELF_SORT_KEY, sort, BOOKSHELF_SORT_VALUES);
}

/** @returns {'asc'|'desc'} */
export function getBookshelfSortDirection() {
  return readStoredChoice(BOOKSHELF_SORT_DIRECTION_KEY, SORT_DIRECTIONS, 'desc');
}

export function setBookshelfSortDirection(direction) {
  return writeStoredChoice(BOOKSHELF_SORT_DIRECTION_KEY, direction, SORT_DIRECTIONS);
}

const DISCOVER_SORT_VALUES = ['default', 'rating', 'update', 'words'];

/** @returns {'default'|'rating'|'update'|'words'} */
export function getDiscoverSort() {
  return readStoredChoice(DISCOVER_SORT_KEY, DISCOVER_SORT_VALUES, 'default');
}

export function setDiscoverSort(sort) {
  return writeStoredChoice(DISCOVER_SORT_KEY, sort, DISCOVER_SORT_VALUES);
}

/** @returns {'asc'|'desc'} */
export function getDiscoverSortDirection() {
  return readStoredChoice(DISCOVER_SORT_DIRECTION_KEY, SORT_DIRECTIONS, 'desc');
}

export function setDiscoverSortDirection(direction) {
  return writeStoredChoice(DISCOVER_SORT_DIRECTION_KEY, direction, SORT_DIRECTIONS);
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

const THEME_VALUES = ['light', 'dark'];

/** @returns {'light'|'dark'|null} Explicit user choice, or null to follow system. */
export function getStoredTheme() {
  return readStoredChoice(THEME_KEY, THEME_VALUES, null);
}

export function setTheme(theme) {
  return writeStoredChoice(THEME_KEY, theme, THEME_VALUES);
}

