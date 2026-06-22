import { useEffect } from 'react';
import styled from 'styled-components';
import { TOAST_DURATION_MS } from '../../utils/constants';

const ToastWrapper = styled.div`
  position: fixed;
  top: calc(80px + env(safe-area-inset-top));
  right: calc(16px + env(safe-area-inset-right));
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 20px;
  background: var(--card-surface);
  border: var(--retro-border-width) solid var(--accent-color);
  border-radius: var(--border-radius-sm);
  color: var(--accent-color);
  font-size: 14px;
  box-shadow: var(--retro-shadow-hover);
  z-index: 9999;
  max-width: min(320px, calc(100vw - 48px));
  font-family: var(--ui-font-family);
  font-weight: 500;
  letter-spacing: 0.03em;
  animation: toastIn 0.35s cubic-bezier(0.34, 1.4, 0.64, 1) backwards;
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  padding: 8px;
  min-width: 36px;
  min-height: 36px;
  margin: -8px -8px -8px 0;
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  opacity: 0.8;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
    transform: scale(1.2);
  }
`;

function Toast({ message, onExpire }) {
  useEffect(() => {
    if (!message || !onExpire) return;
    const id = setTimeout(onExpire, TOAST_DURATION_MS);
    return () => clearTimeout(id);
  }, [message, onExpire]);

  if (!message) return null;

  return (
    <ToastWrapper role="status" aria-live="polite">
      <span>{message}</span>
      <CloseButton type="button" onClick={onExpire} aria-label="關閉">
        ×
      </CloseButton>
    </ToastWrapper>
  );
}

export default Toast;
