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
export const UI_FONT_MODE_KEY = 'uiFontMode';
export const TEXT_BRIGHTNESS_KEY = 'textBrightness';
export const READER_BACKGROUND_KEY = 'readerBackground';
export const READER_INDENT_KEY = 'readerIndent';
export const READER_CUSTOM_BG_KEY = 'readerCustomBg';
export const READER_CUSTOM_TEXT_KEY = 'readerCustomText';
export const TRADITIONAL_CHINESE_KEY = 'traditionalChinese';
export const BOOK_DISPLAY_VARIANT_KEY = 'bookDisplayVariant';
export const BOOKSHELF_QUICK_ACTION_KEY = 'bookshelfQuickAction';
export const THEME_KEY = 'theme';

export const READER_BACKGROUND_CUSTOM = 'custom';
/** Reader background used until the reader picks one; follows the UI theme. */
export const READER_BACKGROUND_THEME_DEFAULT = { light: '#f0e9e4', dark: '#151b26' };
export const READER_CUSTOM_BG_DEFAULT = '#f0e9e4';
export const READER_CUSTOM_TEXT_DEFAULT = '#1a1a1a';

/**
 * Reader background presets: { value: hex | 'custom', label, textColor? }.
 * `value` is persisted, so existing hexes must stay stable; text colours may be tuned.
 * Text uses warm ink rather than pure black/white (≥ 8.5:1 contrast, less glare over long reads).
 * Ordered light to dark, with similar tones grouped together in the picker.
 */
const READER_INK = '#2b2723';
export const READER_BACKGROUND_OPTIONS = [
  // 白色／紙色
  { value: '#ffffff', label: '純白', textColor: READER_INK },
  { value: '#fffef5', label: '米白', textColor: READER_INK },
  { value: '#f0e9e4', label: '暖紙', textColor: READER_INK },
  // 暖黃
  { value: '#ede5d0', label: '米黃', textColor: READER_INK },
  { value: '#f3e7cf', label: '羊皮紙', textColor: '#43362a' },
  // 灰色
  { value: '#e0e0e0', label: '淺灰', textColor: READER_INK },
  { value: '#d4ccc8', label: '薄暮', textColor: READER_INK },
  // 淺彩色
  { value: '#e8dce4', label: '淡粉', textColor: READER_INK },
  { value: '#e4e0e8', label: '薰衣草', textColor: READER_INK },
  { value: '#c0d0c0', label: '青綠', textColor: '#23302a' },
  // 深色
  { value: '#28221c', label: '夜茶', textColor: '#d9ccb8' },
  { value: '#2c2630', label: '深夜', textColor: '#ddd4dc' },
  { value: '#151b26', label: '夜藍', textColor: '#c5ccd6' },
  { value: '#1a1a1a', label: '灰黑', textColor: '#d4cfc6' },
  { value: '#0a0a0a', label: '深黑', textColor: '#bfbab2' },
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

export const BOOKSHELF_QUICK_ACTION_OPTIONS = [
  { value: true, label: '顯示快捷操作按鈕' },
  { value: false, label: '隱藏快捷操作按鈕' },
];

/** API sources: { value: opaque ID (used with proxy), label: display name } - real URLs live in proxy only */
export const API_OPTIONS = [
  { value: 'default', label: 'auto' },
  { value: 'hk-1', label: 'hk-1' },
  { value: 'hk-2', label: 'hk-2' },
  { value: 'hk-3', label: 'hk-3' },
  { value: 'hk-4', label: 'hk-4' },
  { value: 'hk-5', label: 'hk-5' },
  { value: 'hk-6', label: 'hk-6' },
  { value: 'cn-1', label: 'cn-1' },
  { value: 'cn-2', label: 'cn-2' },
  { value: 'sg-1', label: 'sg-1' },
  { value: 'sg-2', label: 'sg-2' },
];

/**
 * Chinese fonts: { value: CSS font-family (persisted — keep existing strings stable),
 * label, webFont?: Google Fonts css2 `family=` query, loaded on demand by utils/fontLoader,
 * system?: installed-only font, hidden where the device lacks it (utils/fontDetect) }.
 * Grouped by style so similar faces sit together in the pickers.
 * The first entry is the UI default and is preloaded in index.html.
 */
export const CHINESE_FONTS = [
  // 宋體
  { value: "'Noto Serif TC', 'Noto Serif SC', sans-serif", label: '思源宋體', webFont: 'Noto+Serif+TC:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;500;600;700' },
  { value: "'Chiron Sung HK', 'Noto Serif TC', 'Noto Serif SC', serif", label: '昭源宋體', webFont: 'Chiron+Sung+HK:wght@400..700' },
  { value: "'STSong', '华文宋体', 'STFangsong', sans-serif", label: '華文宋體', system: true },
  // 明體
  { value: "'PMingLiU', 'Songti TC', 'Songti SC', sans-serif", label: '新細明體', system: true },
  { value: "'Cactus Classical Serif', 'Noto Serif TC', 'Noto Serif SC', serif", label: '仙人掌明體', webFont: 'Cactus+Classical+Serif' },
  // 楷體
  { value: "'BiauKai', '標楷體', 'Kaiti TC', 'Kaiti SC', sans-serif", label: '標楷體', system: true },
  { value: "'LXGW WenKai TC', 'LXGW WenKai', sans-serif", label: '霞鷸文楷', webFont: 'LXGW+WenKai+TC:wght@400;700&family=LXGW+WenKai:wght@400;700' },
  { value: "'Iansui', 'LXGW WenKai TC', 'Noto Serif TC', sans-serif", label: '芫荽', webFont: 'Iansui' },
  // 黑體
  { value: "'Noto Sans TC', 'Noto Sans SC', sans-serif", label: '思源黑體', webFont: 'Noto+Sans+TC:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700' },
  { value: "'Chiron Hei HK', 'Noto Sans TC', 'Noto Sans SC', sans-serif", label: '昭源黑體', webFont: 'Chiron+Hei+HK:wght@400..700' },
  { value: "'Microsoft JhengHei', 'Heiti TC', 'Heiti SC', sans-serif", label: '微軟正黑體', system: true },
  // 圓體
  { value: "'Huninn', 'Noto Sans TC', 'Noto Sans SC', sans-serif", label: '粉圓', webFont: 'Huninn' },
].map((font) => ({ ...font, fontFamily: font.value }));

/**
 * Chrome typography: default is 思源宋體 (served by the CSS :root font stacks);
 * follow mirrors the reader font; any other font sets one family for both.
 */
export const UI_FONT_MODE_DEFAULT = CHINESE_FONTS[0].value;
export const UI_FONT_MODE_FOLLOW = 'follow';
export const UI_FONT_MODE_OPTIONS = [
  { value: UI_FONT_MODE_FOLLOW, label: '跟隨閱讀字型' },
  ...CHINESE_FONTS,
];

export const SEARCH_RESULT_LIMIT = 50;

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

export const TOAST_DURATION_SUCCESS_MS = 2500;
export const TOAST_DURATION_ERROR_MS = 4000;
export const TOAST_DURATION_WARNING_MS = 4000;
export const TOAST_DURATION_INFO_MS = 2500;
