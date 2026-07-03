import {
  READER_BACKGROUND_OPTIONS,
  READER_BACKGROUND_CUSTOM,
  READER_CUSTOM_BG_DEFAULT,
  READER_CUSTOM_TEXT_DEFAULT,
} from './constants';

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export function isValidHexColor(value) {
  return typeof value === 'string' && HEX_COLOR_RE.test(value);
}

export function isValidReaderBackground(value) {
  return READER_BACKGROUND_OPTIONS.some((o) => o.value === value);
}

/** @returns {{ background: string, textColor: string }} */
export function resolveReaderColors(selection, customColors = {}) {
  if (selection === READER_BACKGROUND_CUSTOM) {
    return {
      background: isValidHexColor(customColors.bg) ? customColors.bg : READER_CUSTOM_BG_DEFAULT,
      textColor: isValidHexColor(customColors.text) ? customColors.text : READER_CUSTOM_TEXT_DEFAULT,
    };
  }

  const preset = READER_BACKGROUND_OPTIONS.find((o) => o.value === selection);
  const fallback = READER_BACKGROUND_OPTIONS[0];
  return {
    background: preset?.value ?? fallback.value,
    textColor: preset?.textColor ?? fallback.textColor,
  };
}
