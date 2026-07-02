import React, { useState } from 'react';
import styled from 'styled-components';
import { ArrowDownUp, BookImage, Languages } from 'lucide-react';
import {
  Modal,
  ModalTitleBar,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
  ModalText,
} from './ModalBase';
import SelectDropdown from './SelectDropdown';
import { BOOK_DISPLAY_VARIANT_OPTIONS, EXPORT_CHAPTER_ORDER_OPTIONS, ZH_CONVERSION_OPTIONS } from '../../utils/constants';
import { runBookEpubExport, runBookTxtExport } from '../../utils/exportBookActions';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;

  & + & {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border-color);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-color-secondary);

  svg {
    color: var(--accent-color);
    flex-shrink: 0;
  }
`;

const SelectField = styled.div`
  width: 100%;

  > div {
    display: flex;
    width: 100%;
  }

  button {
    flex: 1;
    min-width: 0 !important;
    width: 100%;
  }
`;

function ExportBookModal({
  bookId,
  bookInfo,
  defaultSortOrder = 'ascending',
  defaultConversionMode = 'tw',
  defaultDisplayVariant = 'new',
  showToast,
  onClose,
}) {
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);
  const [conversionMode, setConversionMode] = useState(defaultConversionMode);
  const [displayVariant, setDisplayVariant] = useState(defaultDisplayVariant);
  const [exporting, setExporting] = useState(null);

  const handleExportTxt = async () => {
    if (!bookId || exporting) return;
    setExporting('txt');
    try {
      await runBookTxtExport({
        bookId,
        bookInfo,
        showToast,
        sortOrder,
        conversionMode,
        displayVariant,
      });
    } finally {
      setExporting(null);
    }
  };

  const handleExportEpub = async () => {
    if (!bookId || exporting) return;
    setExporting('epub');
    try {
      await runBookEpubExport({
        bookId,
        bookInfo,
        showToast,
        sortOrder,
        conversionMode,
        displayVariant,
      });
    } finally {
      setExporting(null);
    }
  };

  return (
    <Modal onClose={onClose} maxWidth="420px">
      <ModalTitleBar title="匯出書籍" onClose={onClose} />
      <ModalBody $scroll={false}>
        <ModalText>僅匯出已下載的章節。請選擇章節順序、書名封面版本與繁簡轉換後再匯出。</ModalText>

        <Section>
          <SectionHeader>
            <BookImage size={16} strokeWidth={2.5} aria-hidden />
            <span>書名與封面</span>
          </SectionHeader>
          <SelectField>
            <SelectDropdown
              options={BOOK_DISPLAY_VARIANT_OPTIONS}
              value={displayVariant}
              onChange={setDisplayVariant}
              ariaLabel="選擇書名與封面版本"
              menuAlign="left"
              menuPortal
              openUpward="auto"
              triggerMinWidth={0}
            />
          </SelectField>
        </Section>

        <Section>
          <SectionHeader>
            <ArrowDownUp size={16} strokeWidth={2.5} aria-hidden />
            <span>章節順序</span>
          </SectionHeader>
          <SelectField>
            <SelectDropdown
              options={EXPORT_CHAPTER_ORDER_OPTIONS}
              value={sortOrder}
              onChange={setSortOrder}
              ariaLabel="選擇章節順序"
              menuAlign="left"
              menuPortal
              openUpward="auto"
              triggerMinWidth={0}
            />
          </SelectField>
        </Section>

        <Section>
          <SectionHeader>
            <Languages size={16} strokeWidth={2.5} aria-hidden />
            <span>繁簡轉換</span>
          </SectionHeader>
          <SelectField>
            <SelectDropdown
              options={ZH_CONVERSION_OPTIONS}
              value={conversionMode}
              onChange={setConversionMode}
              ariaLabel="選擇繁簡轉換"
              menuAlign="left"
              menuPortal
              openUpward="auto"
              triggerMinWidth={0}
            />
          </SelectField>
        </Section>
      </ModalBody>
      <ModalFooter $stretch>
        <ModalSecondaryButton
          type="button"
          onClick={handleExportTxt}
          disabled={Boolean(exporting)}
        >
          {exporting === 'txt' ? '匯出中…' : '匯出 TXT'}
        </ModalSecondaryButton>
        <ModalPrimaryButton
          type="button"
          onClick={handleExportEpub}
          disabled={Boolean(exporting)}
        >
          {exporting === 'epub' ? '匯出中…' : '匯出 EPUB'}
        </ModalPrimaryButton>
      </ModalFooter>
    </Modal>
  );
}

export default ExportBookModal;
