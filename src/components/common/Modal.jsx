import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: max(20px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right)) max(20px, env(safe-area-inset-bottom)) max(20px, env(safe-area-inset-left));
  backdrop-filter: blur(2px);
`;

const ModalContent = styled.div`
  background: var(--background-color);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: 0;
  padding: 24px;
  max-width: 560px;
  max-height: 70vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-shadow: 10px 10px 0px var(--background-color2);

  @media (max-width: 480px) {
    padding: 16px;
    max-height: 80dvh;
  }
`;

const ModalText = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-color);
  white-space: pre-line;
  word-break: break-word;
  font-family: inherit;
`;

const ModalButton = styled.button`
  display: block;
  margin-top: 20px;
  padding: 8px 24px;
  background: var(--accent-color);
  color: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 0;
  cursor: pointer;
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  box-shadow: 4px 4px 0px var(--background-color2);
  transition: all 0.1s steps(2);

  &:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px var(--background-color2);
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 0px 0px 0px #000;
  }
`;

function Modal({ text, onClose }) {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalText>{text}</ModalText>
        <ModalButton type="button" onClick={onClose}>
          收起
        </ModalButton>
      </ModalContent>
    </ModalOverlay>
  );
}

export default Modal;
