import {
  CANONICAL_SITE_URL,
  CANONICAL_HOSTNAME,
  DATA_BACKUP_VERSION,
  DATA_BACKUP_EXTENSION,
  LEGACY_HOSTNAMES,
  DIRECTORY_CACHE_KEY,
  CHAPTER_CACHE_KEY,
  DETAIL_CACHE_KEY,
  API_SERVICE_KEY,
  CATALOG_SORT_DIRECTION_KEY,
  CATALOG_MANAGE_MODE_KEY,
  FONT_SIZE_KEY,
  FONT_FAMILY_KEY,
  TEXT_BRIGHTNESS_KEY,
  READER_BACKGROUND_KEY,
  TRADITIONAL_CHINESE_KEY,
  THEME_KEY,
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
  READING_HISTORY_LEGACY_KEY,
} from './constants';
import { getAllStoreEntries, importStoreEntries } from './cache';
import { triggerFileDownload } from './export/downloadFile';
import { safeGetItem, safeSetItem } from './storage';

const LOCAL_STORAGE_KEYS = [
  API_SERVICE_KEY,
  CATALOG_SORT_DIRECTION_KEY,
  CATALOG_MANAGE_MODE_KEY,
  FONT_SIZE_KEY,
  FONT_FAMILY_KEY,
  TEXT_BRIGHTNESS_KEY,
  READER_BACKGROUND_KEY,
  TRADITIONAL_CHINESE_KEY,
  THEME_KEY,
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
  READING_HISTORY_LEGACY_KEY,
];

export function getHostname() {
  if (typeof window === 'undefined') return '';
  return window.location.hostname;
}

export function isLegacyOrigin(hostname = getHostname()) {
  return LEGACY_HOSTNAMES.includes(hostname);
}

export function isCanonicalOrigin(hostname = getHostname()) {
  return hostname === CANONICAL_HOSTNAME;
}

function collectLocalStorageSnapshot() {
  const snapshot = {};
  for (const key of LOCAL_STORAGE_KEYS) {
    const value = safeGetItem(key);
    if (value != null) snapshot[key] = value;
  }
  return snapshot;
}

function restoreLocalStorageSnapshot(snapshot) {
  if (!snapshot || typeof snapshot !== 'object') return 0;
  let count = 0;
  for (const [key, value] of Object.entries(snapshot)) {
    if (!LOCAL_STORAGE_KEYS.includes(key)) continue;
    if (typeof value === 'string' && safeSetItem(key, value)) count += 1;
  }
  return count;
}

export function summarizeBackupData(indexedDB = {}) {
  const keys = Object.keys(indexedDB);
  return {
    totalKeys: keys.length,
    chapters: keys.filter((k) => k.startsWith(`${CHAPTER_CACHE_KEY}-`)).length,
    directories: keys.filter((k) => k.startsWith(`${DIRECTORY_CACHE_KEY}-`)).length,
    details: keys.filter((k) => k.startsWith(`${DETAIL_CACHE_KEY}-`)).length,
    localStorageKeys: 0,
  };
}

function buildBackupFilename() {
  const date = new Date().toISOString().slice(0, 10);
  return `fanqietc-backup-${date}${DATA_BACKUP_EXTENSION}`;
}

function downloadJsonBackup(payload) {
  const json = JSON.stringify(payload);
  return triggerFileDownload(json, buildBackupFilename());
}

export async function exportUserData() {
  const indexedDB = await getAllStoreEntries();
  const localStorage = collectLocalStorageSnapshot();
  const payload = {
    version: DATA_BACKUP_VERSION,
    app: 'fanqietc',
    exportedAt: new Date().toISOString(),
    origin: typeof window !== 'undefined' ? window.location.origin : CANONICAL_SITE_URL,
    indexedDB,
    localStorage,
  };
  const byteLength = downloadJsonBackup(payload);
  const summary = summarizeBackupData(indexedDB);
  summary.localStorageKeys = Object.keys(localStorage).length;
  return { ...summary, byteLength };
}

function parseBackupFile(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('檔案格式無效，請確認上傳的是 .fanqie-backup 備份檔。');
  }
  if (data?.app !== 'fanqietc' || typeof data.indexedDB !== 'object') {
    throw new Error('此檔案不是有效的番茄閱讀備份。');
  }
  if (data.version !== DATA_BACKUP_VERSION) {
    throw new Error(`不支援的備份版本（${data.version ?? '未知'}）。請更新網站後再試。`);
  }
  return data;
}

function hasBackupExtension(filename) {
  return filename?.toLowerCase().endsWith(DATA_BACKUP_EXTENSION);
}

export { hasBackupExtension };

export async function importUserData(file) {
  if (!file) throw new Error('請選擇備份檔案。');
  if (!hasBackupExtension(file.name)) {
    throw new Error(`請選擇 ${DATA_BACKUP_EXTENSION} 備份檔，不接受其他副檔名。`);
  }

  const text = await file.text();
  const data = parseBackupFile(text);
  const indexedCount = await importStoreEntries(data.indexedDB);
  const localStorageCount = restoreLocalStorageSnapshot(data.localStorage);
  const summary = summarizeBackupData(data.indexedDB);
  return {
    ...summary,
    indexedCount,
    localStorageCount,
    exportedAt: data.exportedAt,
    origin: data.origin,
  };
}
