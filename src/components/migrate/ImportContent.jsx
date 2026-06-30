import { useRef, useState } from 'react';
import PageContent from '../common/PageContent';
import { GrayButton } from '../common/GrayButton';
import HostCodeList from '../common/HostCodeList';
import { useToast } from '../../contexts/ToastContext';
import {
  CANONICAL_HOSTNAME,
  CANONICAL_IMPORT_URL,
  DATA_BACKUP_EXTENSION,
  LEGACY_HOSTNAMES,
} from '../../utils/constants';
import { importUserData, isCanonicalOrigin } from '../../utils/dataMigration';
import { ActionRow, FileInput, FileLabel, Hint, Section, SectionTitle, StepCard } from './styles';

function ImportContent() {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const onCanonicalSite = isCanonicalOrigin();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) {
      showToast('請先選擇備份檔案。');
      return;
    }
    setImporting(true);
    try {
      const summary = await importUserData(selectedFile);
      showToast(
        `匯入完成：${summary.chapters} 章節、${summary.directories} 本目錄、${summary.localStorageCount} 項設定。`
      );
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      showToast(error?.message || '匯入失敗，請確認檔案是否正確。');
    } finally {
      setImporting(false);
    }
  };

  return (
    <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
      <Section>
        <SectionTitle>資料遷移 — 匯入</SectionTitle>

        <StepCard>
          <b>匯入前請確認</b>
          <ol>
            <li>
              您已在舊站（<HostCodeList hostnames={LEGACY_HOSTNAMES} />）完成匯出。
            </li>
            <li>備份檔副檔名為 <code>{DATA_BACKUP_EXTENSION}</code>。</li>
            <li>
              建議在 <code>{CANONICAL_HOSTNAME}</code> 執行匯入，資料才會寫入新網域。
            </li>
          </ol>
          {!onCanonicalSite && (
            <Hint>
              您目前不在 {CANONICAL_HOSTNAME}。匯入仍會寫入<strong>目前網域</strong>的本機儲存；若要遷移至新站，請在{' '}
              {CANONICAL_IMPORT_URL.replace('https://', '')} 開啟此頁。
            </Hint>
          )}
        </StepCard>

        <StepCard>
          <b>上傳備份檔</b>
          <p>選擇從舊站匯出的備份檔，匯入後會覆寫同名的本機快取與設定。</p>
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
