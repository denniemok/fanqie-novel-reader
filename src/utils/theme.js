import { getStoredTheme } from './storage';

const THEME_COLORS = {
  light: '#f1ede6',
  dark: '#0f131b',
};

/** @returns {'light'|'dark'} */
export function getSystemTheme() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** @param {'light'|'dark'|null|undefined} stored */
export function resolveTheme(stored) {
  return stored === 'light' || stored === 'dark' ? stored : getSystemTheme();
}

/** Resolved theme: explicit stored preference, else OS preference. */
export function getTheme() {
  return resolveTheme(getStoredTheme());
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  const isDark = theme === 'dark';
  if (isDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', isDark ? THEME_COLORS.dark : THEME_COLORS.light);
  }
}
