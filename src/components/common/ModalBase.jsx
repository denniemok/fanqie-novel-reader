import React from 'react';
import styled, { css } from 'styled-components';
import { X } from 'lucide-react';

export const modalScrollStyles = css`
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--accent-color) 45%, var(--border-color)) transparent;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--accent-color) 35%, var(--border-color));
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  @media (hover: hover) {
    &::-webkit-scrollbar-thumb:hover {
      background: color-mix(in srgb, var(--accent-color) 65%, var(--border-color));
      background-clip: padding-box;
    }
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: var(--overlay-bg);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: max(24px, env(safe-area-inset-top)) max(24px, env(safe-area-inset-right))
    max(24px, env(safe-area-inset-bottom)) max(24px, env(safe-area-inset-left));

  @media (max-width: 480px) {
    padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right))
      max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left));
  }
`;

export const ModalBox = styled.div`
  background: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius);
  box-shadow: var(--retro-shadow);
  width: 100%;
  max-width: ${(p) => p.$maxWidth ?? '380px'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  font-family: var(--display-font-family);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-color);
  letter-spacing: 0.06em;
  padding: 12px 16px;
  background: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const ModalCloseButton = styled.button`
  padding: 0;
  width: 36px;
  height: 36px;
  box-sizing: border-box;
  border: 1px solid var(--border-color);
  background: var(--background-color2);
  color: var(--text-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.1s steps(2);

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    filter: brightness(1.2);
  }
`;

export const ModalBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 0;

  ${(p) => (p.$scroll !== false) && css`
    max-height: min(360px, 52dvh);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    ${modalScrollStyles}
  `}
`;

export const ModalScrollRegion = styled.div`
  flex: 1;
  min-height: 0;
  max-height: min(320px, 48dvh);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  margin: 0 -2px;
  padding: 2px 4px 2px 2px;
  ${modalScrollStyles}
`;

export const ModalText = styled.p`
  font-size: 13px;
  color: var(--text-color-secondary);
  line-height: 1.6;
  margin: 0;
  white-space: pre-line;
  word-break: break-word;

  strong {
    color: var(--text-color);
    font-weight: 900;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  justify-content: flex-end;
`;

export const ModalFooterRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
  min-width: 0;
  align-items: stretch;
`;

export const ModalInput = styled.input`
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  padding: 8px 10px;
  background: var(--background-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  font-size: 13px;
  font-family: inherit;
  outline: none;

  &:focus {
    border-color: var(--accent-color);
  }

  &::placeholder {
    color: var(--text-color-secondary);
    opacity: 0.5;
  }
`;

const modalButtonStyles = `
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.1s steps(2);
  text-transform: uppercase;
  font-family: inherit;

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px #000;
  }
`;

export const ModalPrimaryButton = styled.button`
  ${modalButtonStyles}
  flex-shrink: 0;
  box-sizing: border-box;
  background: var(--accent-color);
  color: #000;
  border: 2px solid #000;
  box-shadow: 2px 2px 0px #000;

  &:hover {
    background: var(--accent-hover);
  }
`;

export const ModalDangerButton = styled.button`
  ${modalButtonStyles}
  background: #aa5555;
  color: #000;
  border: 2px solid #000;
  box-shadow: 2px 2px 0px #000;

  &:hover {
    filter: brightness(1.1);
  }
`;

export const ModalSecondaryButton = styled.button`
  ${modalButtonStyles}
  background: var(--background-color2);
  color: var(--text-color);
  border: 2px solid #000;
  box-shadow: 2px 2px 0px #000;
`;

export function Modal({ onClose, children, maxWidth }) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()} $maxWidth={maxWidth}>
        {children}
      </ModalBox>
    </ModalOverlay>
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
