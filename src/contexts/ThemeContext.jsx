import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getStoredTheme, setTheme as persistTheme } from '../utils/storage';
import { applyTheme, getSystemTheme, getTheme, resolveTheme } from '../utils/theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  // themeMode is the user's choice; theme is what is actually applied.
  const [themeMode, setThemeMode] = useState(() => getStoredTheme() ?? 'system');
  const [theme, setThemeState] = useState(() => getTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (getStoredTheme() == null) setThemeState(getSystemTheme());
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  /** @param {'light'|'dark'|'system'} next */
  const setTheme = useCallback((next) => {
    const mode = next === 'dark' || next === 'light' ? next : 'system';
    persistTheme(mode);
    setThemeMode(mode);
    setThemeState(resolveTheme(mode === 'system' ? null : mode));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: resolveTheme(null),
      themeMode: 'system',
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return ctx;
}
