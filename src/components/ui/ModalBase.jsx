import React from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components';
import { X } from 'lucide-react';
import { modalScrollbarStyles } from '../../utils/styled/scrollbars';

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: var(--overlay-bg);
  z-index: 1200;
  display: flex;
  align-items: safe center;
  justify-content: center;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: max(24px, env(safe-area-inset-top)) max(24px, env(safe-area-inset-right))
    max(24px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left));

  @media (max-width: 480px) {
    padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right))
      max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
  }

  @media (max-height: 500px) {
    align-items: flex-start;
    padding: max(8px, env(safe-area-inset-top)) max(8px, env(safe-area-inset-right))
      max(8px, env(safe-area-inset-bottom)) max(8px, env(safe-area-inset-left));
  }
`;

export const ModalBox = styled.div`
  background: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--panel-shadow);
  width: 100%;
  animation: fadeInUp 0.28s var(--ease-out) both;
  max-width: ${(p) => p.$maxWidth ?? '380px'};
  max-height: calc(
    100dvh - max(24px, env(safe-area-inset-top)) - max(24px, env(safe-area-inset-bottom))
  );
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
  margin: auto 0;

  @media (max-width: 480px) {
    max-height: calc(
      100dvh - max(12px, env(safe-area-inset-top)) - max(12px, env(safe-area-inset-bottom))
    );
  }

  @media (max-height: 500px) {
    max-height: calc(
      100dvh - max(8px, env(safe-area-inset-top)) - max(8px, env(safe-area-inset-bottom))
    );
  }
`;

export const ModalHeader = styled.div`
  font-family: var(--display-font-family);
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  letter-spacing: 0.08em;
  padding: 12px 12px 12px 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-shrink: 0;

  @media (max-height: 500px) {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

const ModalCloseButton = styled.button`
  padding: 0;
  width: 36px;
  height: 36px;
  box-sizing: border-box;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--text-color-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: var(--transition-default);

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: var(--hover-background-color);
    color: var(--text-color);
  }

  @media (max-height: 500px) {
    width: 32px;
    height: 32px;
  }
`;

export const ModalBody = styled.div`
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1 1 auto;
  min-height: 0;

  ${(p) => (p.$scroll !== false) && css`
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    ${modalScrollbarStyles}
  `}

  ${(p) => (p.$scroll === false) && css`
    overflow: hidden;
  `}

  @media (max-height: 500px) {
    padding: 12px;
    gap: 6px;
  }
`;

export const ModalScrollRegion = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  margin: 0 -2px;
  padding: 2px 4px 2px 2px;
  ${modalScrollbarStyles}
`;

export const ModalText = styled.p`
  font-size: 14px;
  color: var(--text-color-secondary);
  line-height: 1.75;
  margin: 0;
  white-space: pre-line;
  word-break: break-word;

  strong {
    color: var(--text-color);
    font-weight: 600;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: 8px;
  padding: 14px 20px;
  border-top: 1px solid var(--border-color);
  justify-content: flex-end;
  flex-shrink: 0;

  ${(p) =>
    p.$stretch &&
    css`
      min-width: 0;
      align-items: stretch;
    `}

  @media (max-height: 500px) {
    padding: 8px 12px;
    gap: 6px;
  }

  @media (max-width: 480px) {
    ${(p) =>
      p.$stretch &&
      css`
        flex-direction: column;

        > button,
        > input {
          width: 100%;
        }
      `}
  }
`;

export const ModalInput = styled.input`
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  padding: 9px 12px;
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-xs);
  color: var(--text-color);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: var(--transition-default);

  &:focus {
    border-color: var(--accent-color);
  }

  &::placeholder {
    color: var(--text-color-secondary);
    opacity: 0.5;
  }
`;

const modalButtonStyles = `
  padding: 9px 18px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.06em;
  border-radius: var(--border-radius-sketch);
  cursor: pointer;
  white-space: nowrap;
  transition: var(--transition-default);
  font-family: inherit;

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const ModalPrimaryButton = styled.button`
  ${modalButtonStyles}
  flex-shrink: 0;
  box-sizing: border-box;
  background: var(--accent-color);
  color: var(--text-on-accent);
  border: 1px solid var(--accent-color);

  &:hover:not(:disabled) {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
  }
`;

export const ModalDangerButton = styled.button`
  ${modalButtonStyles}
  background: var(--toast-error-color);
  color: var(--background-color2);
  border: 1px solid var(--toast-error-color);

  &:hover:not(:disabled) {
    filter: brightness(1.08);
  }
`;

export const ModalSecondaryButton = styled.button`
  ${modalButtonStyles}
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-strong);

  &:hover:not(:disabled) {
    background: var(--hover-background-color);
  }
`;

export function Modal({ onClose, children, maxWidth }) {
  return createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()} $maxWidth={maxWidth}>
        {children}
      </ModalBox>
    </ModalOverlay>,
    document.body,
  );
}

export function ModalTitleBar({ title, onClose }) {
  return (
    <ModalHeader>
      <span>{title}</span>
      {onClose && (
        <ModalCloseButton type="button" onClick={onClose} title="關閉" aria-label="關閉">
          <X />
        </ModalCloseButton>
      )}
    </ModalHeader>
  );
}
