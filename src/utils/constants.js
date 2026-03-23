export const INDEXEDDB_STORE_NAME = 'fanqie-database';
export const DIRECTORY_CACHE_KEY = 'fanqie-directory';
export const CHAPTER_CACHE_KEY = 'fanqie-chapter';
export const DETAIL_CACHE_KEY = 'fanqie-detail';
export const READING_HISTORY_KEY = 'fanqie-readingHistory';
export const API_BASE_KEY = 'apiBase';
export const SORT_ORDER_KEY = 'sortOrder';
export const FONT_SIZE_KEY = 'fontSize';
export const FONT_FAMILY_KEY = 'fontFamily';
export const TEXT_BRIGHTNESS_KEY = 'textBrightness';
export const READER_BACKGROUND_KEY = 'readerBackground';
export const TRADITIONAL_CHINESE_KEY = 'traditionalChinese';

/** Reader background presets: { value: hex, label } */
export const READER_BACKGROUND_OPTIONS = [
  { value: '#0a0a0a', label: '深色', textColor: 'var(--text-color)' },
  { value: '#1a1a1a', label: '灰黑', textColor: 'var(--text-color)' },
  { value: '#c0d0c0', label: '青綠', textColor: '#1a1a1a' },
  { value: '#ede5d0', label: '米黃', textColor: '#1a1a1a' },
  { value: '#e0e0e0', label: '淺灰', textColor: '#1a1a1a' },
  { value: '#fffef5', label: '米白', textColor: '#1a1a1a' },
  { value: '#ffffff', label: '純白', textColor: '#1a1a1a' },
];

/** Chinese conversion modes: { value, label } */
export const ZH_CONVERSION_OPTIONS = [
  { value: 'original', label: '原文簡體' },
  { value: 'tw', label: '臺灣繁體' },
  { value: 'hk', label: '香港繁體' },
];

/** API sources: { value: opaque ID (used with proxy), label: display name } — real URLs live in proxy only */
export const API_OPTIONS = [
  { value: 'basic-1', label: '一般服務 (暫不可用)' },
  { value: 'basic-2', label: '混合服務' },
  { value: 'basic-3', label: '快速服務' },
];

/** Chinese fonts for reader: { value: CSS font-family, label: display name } */
export const CHINESE_FONTS = [
  { value: "'Noto Serif TC', 'Noto Serif SC', sans-serif", label: '系統預設' },
  { value: "'Noto Serif TC', 'Noto Serif SC', sans-serif", label: '思源宋體' },
  { value: "'PMingLiU', 'Songti TC', 'Songti SC', sans-serif", label: '新細明體' },
  { value: "'STSong', '华文宋体', 'STFangsong', sans-serif", label: '華文宋體' },
  { value: "'BiauKai', '標楷體', 'Kaiti TC', 'Kaiti SC', sans-serif", label: '標楷體' },
  { value: "'LXGW WenKai TC', 'LXGW WenKai', sans-serif", label: '霞鷸文楷' },
  { value: "'Noto Sans TC', 'Noto Sans SC', sans-serif", label: '思源黑體' },
  { value: "'Microsoft JhengHei', 'Heiti TC', 'Heiti SC', sans-serif", label: '微軟正黑體' },
];

export const FONT_SIZE_MIN = 18;
export const FONT_SIZE_MAX = 56;
export const FONT_SIZE_DEFAULT = 32;
export const FONT_SIZE_STEP = 2;
export const TEXT_BRIGHTNESS_MIN = 20;
export const TEXT_BRIGHTNESS_MAX = 100;
export const TEXT_BRIGHTNESS_DEFAULT = 50;
export const TEXT_BRIGHTNESS_STEP = 5;
export const READING_HISTORY_MAX = 50;
export const MAX_CONCURRENT_DOWNLOADS = 10;
export const BATCH_COOLDOWN_MS = 5000;
export const RETRY_DELAY_MS = 5000;
export const TOAST_DURATION_MS = 2000;
export const REQUEST_TIMEOUT_MS = 45000;
export const MAX_ABSTRACT_LENGTH = 180;
export const MOBILE_ABSTRACT_LENGTH = 45;
