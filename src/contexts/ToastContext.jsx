import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/ui/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [message, setMessage] = useState(null);

  const showToast = useCallback((msg) => {
    setMessage(msg);
  }, []);

  const clearToast = useCallback(() => {
    setMessage(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, clearToast }}>
      {children}
      <Toast message={message} onExpire={clearToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { showToast: () => {}, clearToast: () => {} };
  return ctx;
}
