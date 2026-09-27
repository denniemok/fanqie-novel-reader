import { CHINESE_FONTS } from './constants';

/*
 * System fonts (新細明體, 標楷體, …) exist only on some devices; elsewhere the browser
 * silently falls back, so the option would render as something else. Detect them by
 * measuring text: a missing family renders in the fallback face at the fallback width.
 */
const SAMPLE = '永和書院燈籠 WMmi 123';
const BASELINES = ['monospace', 'serif'];
const GENERIC_FAMILIES = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui']);
const installedCache = new Map();
let context;

function measure(fontStack) {
  context.font = `72px ${fontStack}`;
  return context.measureText(SAMPLE).width;
}

function isFamilyInstalled(family) {
  if (installedCache.has(family)) return installedCache.get(family);
  let installed = true;
  try {
    context = context || document.createElement('canvas').getContext('2d');
    if (context) {
      installed = BASELINES.some((base) => measure(`'${family}', ${base}`) !== measure(base));
    }
  } catch {
    // No canvas (or no document): assume available rather than hiding options.
  }
  installedCache.set(family, installed);
  return installed;
}

function familiesOf(fontValue) {
  return fontValue
    .split(',')
    .map((part) => part.trim().replace(/^['"]|['"]$/g, ''))
    .filter((family) => family && !GENERIC_FAMILIES.has(family));
}

/** False only for a system font whose families are all missing on this device. */
export function isFontAvailable(fontValue) {
  const font = CHINESE_FONTS.find((f) => f.value === fontValue);
  if (!font?.system) return true;
  return familiesOf(font.value).some(isFamilyInstalled);
}

/** Drop system fonts this device lacks from a list of { value } options. */
export function filterAvailableFonts(options) {
  return options.filter((option) => isFontAvailable(option.value));
}
