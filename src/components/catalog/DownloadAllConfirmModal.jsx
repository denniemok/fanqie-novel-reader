import React from 'react';
import styled from 'styled-components';
import {
  Modal,
  ModalTitleBar,
  ModalBody,
  ModalText,
  ModalFooter,
  ModalPrimaryButton,
} from '../common/ModalBase';

const ModalSecondaryButton = styled.button`
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.1s steps(2);
  text-transform: uppercase;
  font-family: inherit;
  background: var(--background-color2);
  color: var(--text-color);
  border: 2px solid #000;
  box-shadow: 2px 2px 0px #000;

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px #000;
  }
`;

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
