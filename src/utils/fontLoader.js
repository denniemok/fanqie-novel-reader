import { CHINESE_FONTS } from './constants';

/*
 * CJK Google Fonts ship one @font-face per unicode-range slice, so each family's
 * stylesheet alone is 120–300 KB. Only the UI default (CHINESE_FONTS[0]) is linked in
 * index.html; every other font's stylesheet is added the first time it is needed.
 */
const requested = new Set([CHINESE_FONTS[0].webFont]);

function appendStylesheet(query) {
  if (typeof document === 'undefined' || !query || requested.has(query)) return;
  requested.add(query);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${query}&display=swap`;
  document.head.appendChild(link);
}

/** Load the web font behind a CHINESE_FONTS value (no-op for system fonts or ones already loaded). */
export function loadWebFont(fontValue) {
  appendStylesheet(CHINESE_FONTS.find((font) => font.value === fontValue)?.webFont);
}

/** Load every web font, e.g. when a font picker opens and shows each option in its own face. */
export function loadAllWebFonts() {
  CHINESE_FONTS.forEach((font) => appendStylesheet(font.webFont));
}
