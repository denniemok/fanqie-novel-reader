import { useEffect } from 'react';
import styled, { css } from 'styled-components';

const ToastWrapper = styled.div`
  position: fixed;
  top: calc(80px + env(safe-area-inset-top));
  right: calc(16px + env(safe-area-inset-right));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px 12px 16px;
  background: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  border-left: 3px solid var(--toast-color, var(--accent-color));
  border-radius: var(--border-radius-sm);
  color: var(--text-color);
  font-size: 14px;
  box-shadow: var(--panel-shadow);
  z-index: 9999;
  max-width: min(340px, calc(100vw - 32px));
  font-family: var(--ui-font-family);
  font-weight: 500;
  letter-spacing: 0.03em;
  animation: toastIn 0.3s var(--ease-out) backwards;

  ${(p) => p.$type === 'success' && css`
    --toast-color: var(--toast-success-color);
  `}
  ${(p) => p.$type === 'error' && css`
    --toast-color: var(--toast-error-color);
  `}
  ${(p) => p.$type === 'warning' && css`
    --toast-color: var(--toast-warning-color);
  `}
  ${(p) => p.$type === 'info' && css`
    --toast-color: var(--toast-info-color);
  `}
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  padding: 8px;
  min-width: 36px;
  min-height: 36px;
  margin: -8px -8px -8px 0;
  background: none;
  border: none;
  color: var(--text-color-secondary);
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: var(--text-color);
  }
`;

function Toast({ toast, onExpire }) {
  useEffect(() => {
    if (!toast || !onExpire) return;
    const id = setTimeout(onExpire, toast.duration);
    return () => clearTimeout(id);
  }, [toast, onExpire]);

  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <ToastWrapper
      $type={toast.type}
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
    >
      <span>{toast.message}</span>
      <CloseButton type="button" onClick={onExpire} aria-label="關閉">
        ×
      </CloseButton>
    </ToastWrapper>
  );
}

export default Toast;
