import { Converter } from 'opencc-js';
import { getConversionMode } from '../storage';

/** s2twp: Simplified → Taiwan Traditional with phrase conversion (e.g. 软件→軟體, 自行车→腳踏車) */
const converterTw = Converter({ from: 'cn', to: 'twp' });
/** s2hk: Simplified → Hong Kong Traditional (regional variants) */
const converterHk = Converter({ from: 'cn', to: 'hk' });

/**
 * @param {string} text
 * @param {'original'|'tw'|'hk'} [mode] - Override; otherwise uses stored preference
 * @returns {string}
 */
export function maybeConvert(text, mode) {
  const effectiveMode = mode !== undefined ? mode : getConversionMode();
  if (effectiveMode === 'original' || !text || typeof text !== 'string') return text;
  if (effectiveMode === 'hk') return converterHk(text);
  return converterTw(text);
}
