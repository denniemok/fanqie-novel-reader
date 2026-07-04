import { useState } from 'react';
import { ArrowDownUp, BookImage, Languages } from 'lucide-react';
import {
  Modal,
  ModalTitleBar,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
  ModalText,
} from '../ui/ModalBase';
import { MODAL_SELECT_PROPS, Section, SectionHeader, SelectField } from '../ui/ModalFormSection';
import SelectDropdown from '../ui/SelectDropdown';
import { BOOK_DISPLAY_VARIANT_OPTIONS, EXPORT_CHAPTER_ORDER_OPTIONS, ZH_CONVERSION_OPTIONS } from '../../utils/constants';
import { runBookEpubExport, runBookTxtExport } from '../../utils/export/exportBookActions';

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

  const optionSections = [
    {
      icon: BookImage,
      label: '書名與封面',
      options: BOOK_DISPLAY_VARIANT_OPTIONS,
      value: displayVariant,
      onChange: setDisplayVariant,
      ariaLabel: '選擇書名與封面版本',
    },
    {
      icon: ArrowDownUp,
      label: '章節順序',
      options: EXPORT_CHAPTER_ORDER_OPTIONS,
      value: sortOrder,
      onChange: setSortOrder,
      ariaLabel: '選擇章節順序',
    },
    {
      icon: Languages,
      label: '繁簡轉換',
      options: ZH_CONVERSION_OPTIONS,
      value: conversionMode,
      onChange: setConversionMode,
      ariaLabel: '選擇繁簡轉換',
    },
  ];

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
      <ModalBody>
        <ModalText>僅匯出已下載的章節。請選擇章節順序、書名封面版本與繁簡轉換後再匯出。</ModalText>

        {optionSections.map(({ icon: Icon, label, options, value, onChange, ariaLabel }) => (
          <Section key={label}>
            <SectionHeader>
              <Icon size={16} strokeWidth={2.5} aria-hidden />
              <span>{label}</span>
            </SectionHeader>
            <SelectField>
              <SelectDropdown
                options={options}
                value={value}
                onChange={onChange}
                ariaLabel={ariaLabel}
                {...MODAL_SELECT_PROPS}
              />
            </SelectField>
          </Section>
        ))}
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
