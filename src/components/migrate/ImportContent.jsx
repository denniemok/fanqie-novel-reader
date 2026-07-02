import { useRef, useState } from 'react';
import PageContent from '../layout/PageContent';
import { GrayButton } from '../ui/GrayButton';
import HostCodeList from '../settings/HostCodeList';
import { useToast } from '../../contexts/ToastContext';
import {
  CANONICAL_HOSTNAME,
  CANONICAL_IMPORT_URL,
  DATA_BACKUP_EXTENSION,
  LEGACY_HOSTNAMES,
} from '../../utils/constants';
import { importUserData, isCanonicalOrigin, hasBackupExtension } from '../../utils/dataMigration';
import { ActionRow, FileInput, FileLabel, Hint, Section, SectionTitle, StepCard } from './styles';

function ImportContent() {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const onCanonicalSite = isCanonicalOrigin();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setSelectedFile(null);
      return;
    }
    if (!hasBackupExtension(file.name)) {
      showToast(`請選擇 ${DATA_BACKUP_EXTENSION} 結尾的備份檔。`);
      event.target.value = '';
      setSelectedFile(null);
      return;
    }
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
          <b>匯入前的小提醒</b>
          <ol>
            <li>
              請確認您已經在舊站（<HostCodeList hostnames={LEGACY_HOSTNAMES} />）下載好備份檔。
            </li>
            <li>備份檔的副檔名應該要是 <code>{DATA_BACKUP_EXTENSION}</code>。</li>
            <li>
              建議您在 <code>{CANONICAL_HOSTNAME}</code> 進行匯入，資料才會寫進新站喔！
            </li>
          </ol>
          {!onCanonicalSite && (
            <Hint>
              提醒您：您目前不在 {CANONICAL_HOSTNAME}。在這裡匯入只會把資料寫進<strong>目前的網址</strong>；如果要搬家到新站，請在{' '}
              {CANONICAL_IMPORT_URL.replace('https://', '')} 打開這個頁面。
            </Hint>
          )}
        </StepCard>

        <StepCard>
          <b>上傳備份檔</b>
          <p>請選擇從舊站下載的備份檔。匯入後，相同的書籍資料和設定會被覆蓋更新。</p>
          <ActionRow>
            <GrayButton type="button" onClick={() => fileInputRef.current?.click()}>
              選擇檔案
            </GrayButton>
            <GrayButton type="button" onClick={handleImport} disabled={!selectedFile || importing}>
              {importing ? '搬運中…' : '開始匯入'}
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
