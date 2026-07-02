import React, { createContext, useContext, useState, useCallback } from 'react';
import { getBookDisplayVariant, setBookDisplayVariant as persistVariant } from '../utils/storage';

const BookDisplayVariantContext = createContext(null);

export function BookDisplayVariantProvider({ children }) {
  const [variant, setVariantState] = useState(() => getBookDisplayVariant());

  const setVariant = useCallback((next) => {
    const value = next === 'old' ? 'old' : 'new';
    persistVariant(value);
    setVariantState(value);
  }, []);

  return (
    <BookDisplayVariantContext.Provider value={{ variant, setVariant }}>
      {children}
    </BookDisplayVariantContext.Provider>
  );
}

export function useBookDisplayVariant() {
  const ctx = useContext(BookDisplayVariantContext);
  if (!ctx) {
    return {
      variant: getBookDisplayVariant(),
      setVariant: () => {},
    };
  }
  return ctx;
}
