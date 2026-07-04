import React from 'react';
import {
  Modal as ModalRoot,
  ModalTitleBar,
  ModalBody,
  ModalText,
} from './ModalBase';

function SimpleTextModal({ text, onClose, title = '詳情' }) {
  return (
    <ModalRoot onClose={onClose} maxWidth="560px">
      <ModalTitleBar title={title} onClose={onClose} />
      <ModalBody>
        <ModalText>{text}</ModalText>
      </ModalBody>
    </ModalRoot>
  );
}

export default SimpleTextModal;
