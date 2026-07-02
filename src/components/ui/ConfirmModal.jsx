import React from 'react';
import {
  Modal,
  ModalTitleBar,
  ModalBody,
  ModalText,
  ModalFooter,
  ModalPrimaryButton,
  ModalDangerButton,
} from './ModalBase';

function ConfirmModal({
  title,
  message,
  confirmLabel = '確認',
  cancelLabel = '取消',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal onClose={onCancel}>
      <ModalTitleBar title={title} onClose={onCancel} />
      <ModalBody>
        {typeof message === 'string' ? <ModalText>{message}</ModalText> : message}
      </ModalBody>
      <ModalFooter>
        <ModalDangerButton type="button" onClick={onCancel}>
          {cancelLabel}
        </ModalDangerButton>
        <ModalPrimaryButton type="button" onClick={onConfirm}>
          {confirmLabel}
        </ModalPrimaryButton>
      </ModalFooter>
    </Modal>
  );
}

export default ConfirmModal;
