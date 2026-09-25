import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getFontFamily, getUiFontMode, setUiFontMode as persistUiFontMode } from '../utils/storage';
import { applyChromeFonts, isValidUiFontMode } from '../utils/uiFont';
import { UI_FONT_MODE_BRAND } from '../utils/constants';

const UiFontContext = createContext(null);

export function UiFontProvider({ children }) {
  const [mode, setModeState] = useState(() => getUiFontMode());

  useEffect(() => {
    applyChromeFonts(mode, getFontFamily());
  }, [mode]);

  const setMode = useCallback((next) => {
    if (!isValidUiFontMode(next)) return;
    persistUiFontMode(next);
    setModeState(next);
  }, []);

  return (
    <UiFontContext.Provider value={{ mode, setMode }}>
      {children}
    </UiFontContext.Provider>
  );
}

export function useUiFont() {
  const ctx = useContext(UiFontContext);
  if (!ctx) {
    return {
      mode: UI_FONT_MODE_BRAND,
      setMode: () => {},
    };
  }
  return ctx;
}
