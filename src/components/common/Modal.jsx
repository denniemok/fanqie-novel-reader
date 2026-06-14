import React from 'react';
import {
  Modal as ModalRoot,
  ModalTitleBar,
  ModalBody,
  ModalText,
  ModalFooter,
  ModalPrimaryButton,
} from './ModalBase';

function Modal({ text, onClose, title = '詳情' }) {
  return (
    <ModalRoot onClose={onClose} maxWidth="560px">
      <ModalTitleBar title={title} onClose={onClose} />
      <ModalBody>
        <ModalText>{text}</ModalText>
      </ModalBody>
      <ModalFooter>
        <ModalPrimaryButton type="button" onClick={onClose}>
          收起
        </ModalPrimaryButton>
      </ModalFooter>
    </ModalRoot>
  );
}

export default Modal;
