export const INDEXEDDB_STORE_NAME = 'fanqie-database';
export const DIRECTORY_CACHE_KEY = 'fanqie-directory';
export const CHAPTER_CACHE_KEY = 'fanqie-chapter';
export const DETAIL_CACHE_KEY = 'fanqie-detail';
export const API_BASE_KEY = 'fanqie-api-base';
export const READING_HISTORY_KEY = 'fanqie-readingHistory';
export const FONT_SIZE_KEY = 'fanqie-fontSize';
export const FONT_FAMILY_KEY = 'fanqie-fontFamily';
export const TRADITIONAL_CHINESE_KEY = 'fanqie-traditionalChinese';
export const TEXT_BRIGHTNESS_KEY = 'fanqie-textBrightness';
export const READER_BACKGROUND_KEY = 'fanqie-readerBackground';

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
  { value: 'original', label: '簡體中文' },
  { value: 'tw', label: '繁體 (台灣)' },
  { value: 'hk', label: '繁體 (香港)' },
];

/** API sources: { value: base URL, label: display name } */
export const API_OPTIONS = [
  { value: 'https://bk.yydjtc.cn', label: 'bk.yydjtc.cn' },
  { value: 'https://qkfqapi.vv9v.cn', label: 'qkfqapi.vv9v.cn' },
  { value: 'http://103.236.91.147:9999', label: '103.236.91.147:9999' },
  { value: 'http://101.35.133.34:5000', label: '101.35.133.34:5000' },
];

/** Chinese fonts for reader: { value: CSS font-family, label: display name } */
export const CHINESE_FONTS = [
  { value: "'Noto Serif TC', 'PMingLiU', Georgia, serif", label: '系統預設' },
  { value: "'Noto Serif TC', serif", label: '思源宋體' },
  { value: "'PMingLiU', serif", label: '新細明體' },
  { value: "'STSong', '华文宋体', serif", label: '華文宋體' },
  { value: "'BiauKai', '標楷體', serif", label: '標楷體' },
  { value: "'Noto Sans TC', sans-serif", label: '思源黑體' },
  { value: "'Microsoft JhengHei', sans-serif", label: '微軟正黑體' },
];

export const FONT_SIZE_MIN = 18;
export const FONT_SIZE_MAX = 56;
export const FONT_SIZE_DEFAULT = 32;
export const FONT_SIZE_STEP = 2;
export const TEXT_BRIGHTNESS_MIN = 15;
export const TEXT_BRIGHTNESS_MAX = 100;
export const TEXT_BRIGHTNESS_DEFAULT = 50;
export const TEXT_BRIGHTNESS_STEP = 5;
export const READING_HISTORY_MAX = 50;
export const MAX_CONCURRENT_DOWNLOADS = 10;
export const REQUEST_TIMEOUT_MS = 45000;
export const MAX_ABSTRACT_LENGTH = 180;
export const MOBILE_ABSTRACT_LENGTH = 45;
