import { useState } from 'react';
import {
  getFontSize,
  setFontSize,
  getFontFamily,
  setFontFamily,
  getUiFontMode,
  getTextBrightness,
  setTextBrightness,
  getReaderBackground,
  setReaderBackground,
  getReaderCustomColors,
  setReaderCustomColors,
} from '../utils/storage';
import {
  FONT_SIZE_MIN,
  FONT_SIZE_MAX,
  FONT_SIZE_STEP,
  TEXT_BRIGHTNESS_MIN,
  TEXT_BRIGHTNESS_MAX,
  TEXT_BRIGHTNESS_STEP,
  READER_BACKGROUND_THEME_DEFAULT,
  READER_BACKGROUND_CUSTOM,
} from '../utils/constants';
import { isValidHexColor, resolveReaderColors } from '../utils/readerColors';
import { useTheme } from '../contexts/ThemeContext';
import { applyChromeFonts } from '../utils/uiFont';

function useSteppedValue(readValue, writeValue, { min, max, step }) {
  const [value, setValue] = useState(readValue);

  const changeBy = (delta) => {
    setValue((prev) => {
      const next = prev + delta * step;
      const clamped = Math.max(min, Math.min(max, next));
      writeValue(clamped);
      return clamped;
    });
  };

  return [value, changeBy];
}

export function useFontSize() {
  return useSteppedValue(getFontSize, setFontSize, {
    min: FONT_SIZE_MIN,
    max: FONT_SIZE_MAX,
    step: FONT_SIZE_STEP,
  });
}

export function useFontFamily() {
  const [fontFamily, setFontFamilyState] = useState(getFontFamily);

  const handleFontFamilyChange = (value) => {
    if (!setFontFamily(value)) return;
    setFontFamilyState(value);
    applyChromeFonts(getUiFontMode(), value);
  };

  return [fontFamily, handleFontFamilyChange];
}

export function useTextBrightness() {
  return useSteppedValue(getTextBrightness, setTextBrightness, {
    min: TEXT_BRIGHTNESS_MIN,
    max: TEXT_BRIGHTNESS_MAX,
    step: TEXT_BRIGHTNESS_STEP,
  });
}

export function useReaderBackground() {
  const { theme } = useTheme();
  const [storedBackground, setReaderBackgroundState] = useState(getReaderBackground);
  const readerBackground = storedBackground ?? READER_BACKGROUND_THEME_DEFAULT[theme];
  const [customColors, setCustomColorsState] = useState(getReaderCustomColors);
  const { background: readerBackgroundColor, textColor: readerTextColor } = resolveReaderColors(
    readerBackground,
    customColors,
  );

  const handleReaderBackgroundChange = (value) => {
    setReaderBackground(value);
    setReaderBackgroundState(value);
  };

  const writeCustomColors = (patch) => {
    setReaderCustomColors(patch);
    setCustomColorsState((prev) => ({ ...prev, ...patch }));
  };

  const handleCustomBgChange = (bg) => writeCustomColors({ bg });

  const handleCustomTextChange = (text) => writeCustomColors({ text });

  /** Copy a preset's paper and ink into custom, then select custom so it can be edited. */
  const handleCustomizeFromPreset = (preset) => {
    if (!isValidHexColor(preset?.value) || !isValidHexColor(preset?.textColor)) return;
    writeCustomColors({ bg: preset.value, text: preset.textColor });
    handleReaderBackgroundChange(READER_BACKGROUND_CUSTOM);
  };

  return {
    readerBackground,
    readerBackgroundColor,
    readerTextColor,
    readerCustomBg: customColors.bg,
    readerCustomText: customColors.text,
    handleReaderBackgroundChange,
    handleCustomBgChange,
    handleCustomTextChange,
    handleCustomizeFromPreset,
  };
}
