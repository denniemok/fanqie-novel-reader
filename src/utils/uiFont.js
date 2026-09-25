import { CHINESE_FONTS, UI_FONT_MODE_BRAND, UI_FONT_MODE_FOLLOW } from './constants';

export function isValidUiFontMode(mode) {
  return (
    mode === UI_FONT_MODE_BRAND ||
    mode === UI_FONT_MODE_FOLLOW ||
    CHINESE_FONTS.some((font) => font.value === mode)
  );
}

/** @returns {{ ui: string, display: string } | null} null means use CSS :root defaults */
export function resolveChromeFonts(mode, readerFontFamily) {
  if (mode === UI_FONT_MODE_BRAND || !isValidUiFontMode(mode)) {
    return null;
  }
  if (mode === UI_FONT_MODE_FOLLOW) {
    const family = readerFontFamily || CHINESE_FONTS[0].value;
    return { ui: family, display: family };
  }
  return { ui: mode, display: mode };
}

export function applyChromeFonts(mode, readerFontFamily) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const resolved = resolveChromeFonts(mode, readerFontFamily);
  if (!resolved) {
    root.style.removeProperty('--ui-font-family');
    root.style.removeProperty('--display-font-family');
    return;
  }
  root.style.setProperty('--ui-font-family', resolved.ui);
  root.style.setProperty('--display-font-family', resolved.display);
}
