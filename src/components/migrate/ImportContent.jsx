import { useRef, useState } from 'react';
import PageContent from '../layout/PageContent';
import { GrayButton } from '../ui/GrayButton';
import { useToast } from '../../contexts/ToastContext';
import { useReplaceRules } from '../../hooks/useConversionMode';
import { DATA_BACKUP_EXTENSION } from '../../utils/constants';
import { importUserData, hasBackupExtension } from '../../utils/dataMigration';
import { ActionRow, FileInput, FileLabel, Section, SectionTitle, StepCard } from './styles';

function ImportContent() {
  const { notifyError, notifySuccess, notifyWarning } = useToast();
  const { reloadReplaceRules } = useReplaceRules();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (!hasBackupExtension(file.name)) {
      notifyWarning(`請選擇 ${DATA_BACKUP_EXTENSION} 結尾的備份檔。`);
      event.target.value = '';
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      notifyWarning('請先選擇備份檔案。');
      return;
    }
    setImporting(true);
    try {
      const summary = await importUserData(selectedFile);
      await reloadReplaceRules();
      notifySuccess(
        `匯入完成：${summary.chapters} 章節、${summary.directories} 本目錄、${summary.details} 本書籍。`,
      );
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      notifyError(null, error?.message || '匯入失敗，請確認檔案是否正確。');
    } finally {
      setImporting(false);
    }
  };

  return (
    <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
      <Section>
        <SectionTitle>備份資料 — 匯入</SectionTitle>

        <StepCard>
          <b>上傳備份檔</b>
          <p>
            選擇之前匯出的 <code>{DATA_BACKUP_EXTENSION}</code> 檔案。匯入後，相同書籍的資料會以備份為準更新，本機的閱讀設定不會變更。
          </p>
          <ActionRow>
            <GrayButton type="button" onClick={() => fileInputRef.current?.click()}>
              選擇檔案
            </GrayButton>
            <GrayButton type="button" onClick={handleImport} disabled={!selectedFile || importing}>
              {importing ? '匯入中…' : '開始匯入'}
            </GrayButton>
          </ActionRow>
          <FileInput
            ref={fileInputRef}
            type="file"
            accept={DATA_BACKUP_EXTENSION}
            onChange={handleFileChange}
          />
          {selectedFile && <FileLabel>已選擇：{selectedFile.name}</FileLabel>}
        </StepCard>
      </Section>
    </PageContent>
  );
}

export default ImportContent;
