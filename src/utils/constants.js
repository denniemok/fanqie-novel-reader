export const CANONICAL_SITE_URL = 'https://fanqietc.com';
export const CANONICAL_IMPORT_URL = 'https://fanqietc.com/import';
export const CANONICAL_HOSTNAME = new URL(CANONICAL_SITE_URL).hostname;
export const LEGACY_HOSTNAMES = ['fanqietc.pages.dev', 'fqnr.pages.dev'];
export const DATA_BACKUP_VERSION = 1;
export const DATA_BACKUP_EXTENSION = '.fanqietc-backup';

export const INDEXEDDB_STORE_NAME = 'fanqie-database';
export const DIRECTORY_CACHE_KEY = 'fanqie-directory';
export const CHAPTER_CACHE_KEY = 'fanqie-chapter';
export const DETAIL_CACHE_KEY = 'fanqie-detail';
export const READING_HISTORY_KEY = 'fanqie-history';
export const COLLECTIONS_KEY = 'fanqie-collections';

export const BOOKSHELF_VIEW_MODE_KEY = 'bookshelfViewMode';
export const DISCOVER_VIEW_MODE_KEY = 'discoverViewMode';
export const BOOKSHELF_SORT_KEY = 'bookshelfSort';
export const BOOKSHELF_SORT_DIRECTION_KEY = 'bookshelfSortDir';
export const DISCOVER_SORT_KEY = 'discoverSort';
export const DISCOVER_SORT_DIRECTION_KEY = 'discoverSortDir';
export const BOOKSHELF_ACTIVE_TAB_KEY = 'bookshelfActiveTab';
export const DISCOVER_ACTIVE_TAB_KEY = 'discoverActiveTab';
export const BOOKSHELF_FILTERS_KEY = 'bookshelfFilters';
export const DISCOVER_FILTERS_KEY = 'discoverFilters';
export const API_SERVICE_KEY = 'apiService';
export const CATALOG_SORT_DIRECTION_KEY = 'catalogSortDir';
export const CATALOG_MANAGE_MODE_KEY = 'catalogManageMode';
export const FONT_SIZE_KEY = 'fontSize';
export const FONT_FAMILY_KEY = 'fontFamily';
export const TEXT_BRIGHTNESS_KEY = 'textBrightness';
export const READER_BACKGROUND_KEY = 'readerBackground';
export const READER_CUSTOM_BG_KEY = 'readerCustomBg';
export const READER_CUSTOM_TEXT_KEY = 'readerCustomText';
export const TRADITIONAL_CHINESE_KEY = 'traditionalChinese';
export const BOOK_DISPLAY_VARIANT_KEY = 'bookDisplayVariant';
export const THEME_KEY = 'theme';

export const READER_BACKGROUND_CUSTOM = 'custom';
export const READER_CUSTOM_BG_DEFAULT = '#f0e9e4';
export const READER_CUSTOM_TEXT_DEFAULT = '#1a1a1a';

/** Reader background presets: { value: hex | 'custom', label, textColor? } */
export const READER_BACKGROUND_OPTIONS = [
  { value: '#e8dce4', label: '淡粉', textColor: '#1a1a1a' },
  { value: '#e4e0e8', label: '薰衣草', textColor: '#1a1a1a' },
  { value: '#d4ccc8', label: '薄暮', textColor: '#1a1a1a' },
  { value: '#f0e9e4', label: '暖紙', textColor: '#1a1a1a' },
  { value: '#fffef5', label: '米白', textColor: '#1a1a1a' },
  { value: '#ffffff', label: '純白', textColor: '#1a1a1a' },
  { value: '#e0e0e0', label: '淺灰', textColor: '#1a1a1a' },
  { value: '#ede5d0', label: '米黃', textColor: '#1a1a1a' },
  { value: '#c0d0c0', label: '青綠', textColor: '#1a1a1a' },
  { value: '#2c2630', label: '深夜', textColor: '#e0e0e0' },
  { value: '#1a1a1a', label: '灰黑', textColor: '#e0e0e0' },
  { value: '#0a0a0a', label: '深黑', textColor: '#e0e0e0' },
  { value: READER_BACKGROUND_CUSTOM, label: '自訂' },
];

/** Chinese conversion modes: { value, label } */
export const ZH_CONVERSION_OPTIONS = [
  { value: 'original', label: '原文簡體' },
  { value: 'tw', label: '臺灣繁體' },
  { value: 'hk', label: '香港繁體' },
];

/** Chapter order for book export: { value, label } */
export const EXPORT_CHAPTER_ORDER_OPTIONS = [
  { value: 'ascending', label: '正序（第一章起）' },
  { value: 'descending', label: '倒序（最新章起）' },
];

/** Book metadata display: new (current) vs old (original) title and cover */
export const BOOK_DISPLAY_VARIANT_OPTIONS = [
  { value: 'new', label: '最新書名及封面' },
  { value: 'old', label: '原有書名及封面' },
];

/** API sources: { value: opaque ID (used with proxy), label: display name } - real URLs live in proxy only */
export const API_OPTIONS = [
  { value: 'default', label: 'auto' },
  { value: 'hk-1', label: 'hk-1' },
  { value: 'hk-2', label: 'hk-2' },
  { value: 'hk-3', label: 'hk-3' },
  { value: 'cn-1', label: 'cn-1' },
  { value: 'cn-2', label: 'cn-2' },
  { value: 'in-1', label: 'in-1' },
  { value: 'sg-1', label: 'sg-1' },
  { value: 'sg-2', label: 'sg-2' },
  { value: 'old-1', label: 'old-1' },
];

/** Chinese fonts for reader: { value: CSS font-family, label: display name, fontFamily: preview in dropdown } */
export const CHINESE_FONTS = [
  { value: "'Noto Serif TC', 'Noto Serif SC', sans-serif", label: '思源宋體' },
  { value: "'PMingLiU', 'Songti TC', 'Songti SC', sans-serif", label: '新細明體' },
  { value: "'STSong', '华文宋体', 'STFangsong', sans-serif", label: '華文宋體' },
  { value: "'BiauKai', '標楷體', 'Kaiti TC', 'Kaiti SC', sans-serif", label: '標楷體' },
  { value: "'LXGW WenKai TC', 'LXGW WenKai', sans-serif", label: '霞鷸文楷' },
  { value: "'Noto Sans TC', 'Noto Sans SC', sans-serif", label: '思源黑體' },
  { value: "'Microsoft JhengHei', 'Heiti TC', 'Heiti SC', sans-serif", label: '微軟正黑體' },
].map((font) => ({ ...font, fontFamily: font.value }));

export const FONT_SIZE_MIN = 18;
export const FONT_SIZE_MAX = 56;
export const FONT_SIZE_DEFAULT = 32;
export const FONT_SIZE_STEP = 2;
export const TEXT_BRIGHTNESS_MIN = 20;
export const TEXT_BRIGHTNESS_MAX = 100;
export const TEXT_BRIGHTNESS_DEFAULT = 90;
export const TEXT_BRIGHTNESS_STEP = 5;

export const GITHUB_ISSUES_URL = 'https://github.com/denniemok/fanqie-novel-reader/issues';
export const GITHUB_REPO_URL = 'https://github.com/denniemok/fanqie-novel-reader';
export const GITHUB_README_URL = 'https://github.com/denniemok/fanqie-novel-reader/blob/main/README.md';

export const MAX_CONCURRENT_DOWNLOADS = 5;
export const BATCH_COOLDOWN_MS = 5000;
export const RETRY_DELAY_MS = 5000;
export const REQUEST_TIMEOUT_MS = 45000;
export const RATE_LIMIT_RPM = 60;
export const AUTO_BAN_DURATION_MINUTES = 10;

export const TOAST_DURATION_MS = 2000;
