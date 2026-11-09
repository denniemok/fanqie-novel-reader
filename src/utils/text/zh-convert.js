import { Converter, ConverterFactory, Locale } from 'opencc-js';
import { getConversionMode } from '../storage';

/**
 * OpenCC's s2twp bundles TWPhrasesIT, a ~400-entry computing glossary that mangles
 * fiction (运行功法→執行功法, 窗口→視窗, 重装→重灌, 体内存在→體記憶體在).
 * We drop that dictionary, keep the rest of s2twp (自行车→腳踏車, 意大利→義大利),
 * and re-enable only the IT terms below, which are unambiguous everyday nouns.
 * Keys are Traditional because twp dictionaries run after the cn→t step.
 */
const TWP_IT_ALLOWLIST = [
  '軟件', '硬件', '視頻', '鼠標', '屏幕', '網絡', '硬盤', '短信', '博客', '黑客',
  '芯片', 'U盤', '互聯網', '人工智能', '服務器', '數據庫', '操作系統', '打印機',
  '程序員', '代碼', '源代碼', '編程', '藍牙', '網吧', '移動電話', '首席執行官',
  '知識產權', '觸摸屏', '截屏', '激光', '高清',
];

/**
 * Identity entries that block mis-splits. Matching is longest-first, so a longer
 * entry starting at the same character wins over the shorter phrase.
 * e.g. 一般的士兵 would otherwise become 一般計程車兵 (的士 → 計程車).
 */
const TWP_OVERRIDES = [
  ['的士兵', '的士兵'],
  ['的士氣', '的士氣'],
  ['奔馳', '奔馳'], // 奔馳 → 賓士 (the car brand) breaks "galloping"
  ['通過', '通過'], // 通過 → 透過 breaks "pass a test"
  ['黑客棧', '黑客棧'], // 漆黑客棧
  ['短信息', '短信息'], // 簡短信息
  ['高清晰', '高清晰'], // 提高清晰度
];

function createTwConverter() {
  const isItDict = (dict) => typeof dict === 'string' && dict.includes('內存 記憶體');
  const itDict = Locale.to.twp.find(isItDict);
  const itMap = new Map(itDict ? itDict.split('|').map((entry) => entry.split(' ')) : []);
  const allowed = TWP_IT_ALLOWLIST.filter((key) => itMap.has(key)).map((key) => [key, itMap.get(key)]);
  const dicts = Locale.to.twp.filter((dict) => !isItDict(dict));
  return ConverterFactory(Locale.from.cn, dicts.concat([allowed, TWP_OVERRIDES]));
}

/** s2twp without the IT glossary (see TWP_IT_ALLOWLIST) */
const converterTw = createTwConverter();
/** s2hk: Simplified → Hong Kong Traditional (regional variants) */
const converterHk = Converter({ from: 'cn', to: 'hk' });

function convertByMode(text, mode) {
  if (mode === 'original') return text;
  if (mode === 'hk') return converterHk(text);
  return converterTw(text);
}

/**
 * @param {string} text
 * @param {'original'|'tw'|'hk'} [mode] - Override; otherwise uses stored preference
 * @returns {string}
 */
export function maybeConvert(text, mode) {
  if (!text || typeof text !== 'string') return text;
  const effectiveMode = mode !== undefined ? mode : getConversionMode();
  return convertByMode(text, effectiveMode);
}
