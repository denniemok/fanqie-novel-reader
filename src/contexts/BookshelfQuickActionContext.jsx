import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  getBookshelfQuickAction,
  setBookshelfQuickAction as persistBookshelfQuickAction,
} from '../utils/storage';

const BookshelfQuickActionContext = createContext(null);

export function BookshelfQuickActionProvider({ children }) {
  const [enabled, setEnabledState] = useState(() => getBookshelfQuickAction());

  const setEnabled = useCallback((next) => {
    const value = Boolean(next);
    persistBookshelfQuickAction(value);
    setEnabledState(value);
  }, []);

  return (
    <BookshelfQuickActionContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </BookshelfQuickActionContext.Provider>
  );
}

export function useBookshelfQuickAction() {
  const ctx = useContext(BookshelfQuickActionContext);
  if (!ctx) {
    return {
      enabled: getBookshelfQuickAction(),
      setEnabled: () => {},
    };
  }
  return ctx;
}
