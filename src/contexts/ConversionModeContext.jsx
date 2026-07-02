import React, { createContext, useContext, useState, useCallback } from 'react';
import { getConversionMode, setConversionMode as persistConversionMode } from '../utils/storage';

const ConversionModeContext = createContext(null);

export function ConversionModeProvider({ children }) {
  const [conversionMode, setModeState] = useState(() => getConversionMode());

  const setConversionMode = useCallback((newMode) => {
    if (newMode !== 'original' && newMode !== 'tw' && newMode !== 'hk') return;
    persistConversionMode(newMode);
    setModeState(newMode);
  }, []);

  return (
    <ConversionModeContext.Provider value={{ conversionMode, setConversionMode }}>
      {children}
    </ConversionModeContext.Provider>
  );
}

export function useConversionMode() {
  const ctx = useContext(ConversionModeContext);
  if (!ctx) {
    return [getConversionMode(), () => {}];
  }
  return [ctx.conversionMode, ctx.setConversionMode];
}
