import { useEffect } from 'react';
import styled from 'styled-components';

const ToastWrapper = styled.div`
  position: fixed;
  top: calc(80px + env(safe-area-inset-top));
  right: calc(16px + env(safe-area-inset-right));
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 20px;
  background-color: var(--background-color2);
  border: var(--retro-border-width) solid var(--accent-color);
  border-radius: 0;
  color: var(--accent-color);
  font-size: 14px;
  box-shadow: 6px 6px 0px var(--background-color);
  z-index: 9999;
  max-width: min(320px, calc(100vw - 48px));
  font-family: inherit;
  font-weight: 900;
  text-transform: uppercase;
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  padding: 0;
  margin: -4px -4px 0 0;
  background: none;
  border: none;
  color: var(--accent-color);
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    transform: scale(1.2);
  }
`;

function Toast({ message, duration = 2000, onExpire }) {
  useEffect(() => {
    if (!message || !onExpire) return;
    const id = setTimeout(onExpire, duration);
    return () => clearTimeout(id);
  }, [message, duration, onExpire]);

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
