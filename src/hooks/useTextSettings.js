import { useState } from 'react';
import {
  getFontSize,
  setFontSize,
  getFontFamily,
  setFontFamily,
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
} from '../utils/constants';
import { resolveReaderColors } from '../utils/readerColors';

export function useFontSize() {
  const [fontSize, setFontSizeState] = useState(getFontSize);

  const handleFontSizeChange = (delta) => {
    setFontSizeState((prev) => {
      const next = prev + delta * FONT_SIZE_STEP;
      const clamped = Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, next));
      setFontSize(clamped);
      return clamped;
    });
  };

  return [fontSize, handleFontSizeChange];
}

export function useFontFamily() {
  const [fontFamily, setFontFamilyState] = useState(getFontFamily);

  const handleFontFamilyChange = (value) => {
    setFontFamily(value);
    setFontFamilyState(value);
  };

  return [fontFamily, handleFontFamilyChange];
}

export function useTextBrightness() {
  const [textBrightness, setTextBrightnessState] = useState(getTextBrightness);

  const handleTextBrightnessChange = (delta) => {
    setTextBrightnessState((prev) => {
      const next = prev + delta * TEXT_BRIGHTNESS_STEP;
      const clamped = Math.max(TEXT_BRIGHTNESS_MIN, Math.min(TEXT_BRIGHTNESS_MAX, next));
      setTextBrightness(clamped);
      return clamped;
    });
  };

  return [textBrightness, handleTextBrightnessChange];
}

export function useReaderBackground() {
  const [readerBackground, setReaderBackgroundState] = useState(getReaderBackground);
  const [customColors, setCustomColorsState] = useState(getReaderCustomColors);
  const { background: readerBackgroundColor, textColor: readerTextColor } = resolveReaderColors(
    readerBackground,
    customColors,
  );

  const handleReaderBackgroundChange = (value) => {
    setReaderBackground(value);
    setReaderBackgroundState(value);
  };

  const handleCustomBgChange = (bg) => {
    const next = { ...customColors, bg };
    setReaderCustomColors({ bg });
    setCustomColorsState(next);
  };

  const handleCustomTextChange = (text) => {
    const next = { ...customColors, text };
    setReaderCustomColors({ text });
    setCustomColorsState(next);
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
  };
}
