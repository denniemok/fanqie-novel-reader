import React from 'react';
import {
  Modal,
  ModalTitleBar,
  ModalBody,
  ModalText,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
} from '../ui/ModalBase';

function DownloadAllConfirmModal({ chapterCount, onStay, onGoToDownloadPage, onClose }) {
  return (
    <Modal onClose={onClose}>
      <ModalTitleBar title="開始下載全部" onClose={onClose} />
      <ModalBody $scroll={false}>
        <ModalText>
          即將下載 <strong>{chapterCount}</strong> 章未快取的章節。下載全部一次只會排程一本書，可在下載頁查看進度。
          {'\n\n'}
          是否前往下載頁？
        </ModalText>
      </ModalBody>
      <ModalFooter>
        <ModalSecondaryButton type="button" onClick={onStay}>
          留在目錄
        </ModalSecondaryButton>
        <ModalPrimaryButton type="button" onClick={onGoToDownloadPage}>
          前往下載頁
        </ModalPrimaryButton>
      </ModalFooter>
    </Modal>
  );
}

export default DownloadAllConfirmModal;
