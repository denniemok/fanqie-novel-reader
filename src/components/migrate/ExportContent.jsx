import { useState } from 'react';
import PageContent from '../common/PageContent';
import { GrayButton } from '../common/GrayButton';
import HostCodeList from '../common/HostCodeList';
import { useToast } from '../../contexts/ToastContext';
import {
  CANONICAL_IMPORT_URL,
  CANONICAL_HOSTNAME,
  CANONICAL_SITE_URL,
  LEGACY_HOSTNAMES,
} from '../../utils/constants';
import { exportUserData, isLegacyOrigin } from '../../utils/dataMigration';
import { ActionRow, Hint, Section, SectionTitle, StepCard } from './styles';

function ExportContent() {
  const { showToast } = useToast();
  const [exporting, setExporting] = useState(false);
  const onLegacySite = isLegacyOrigin();

  const handleExport = async () => {
    setExporting(true);
    try {
      const summary = await exportUserData();
      if (summary.totalKeys === 0 && summary.localStorageKeys === 0) {
        showToast('備份檔已下載，但目前沒有可遷移的資料。');
      } else {
        showToast(
          `已匯出備份檔（${summary.chapters} 章節、${summary.directories} 本目錄、${summary.localStorageKeys} 項設定）。`
        );
      }
    } catch {
      showToast('匯出失敗，請稍後再試。');
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
      <Section>
        <SectionTitle>資料遷移 — 匯出</SectionTitle>

        <StepCard>
          <b>誰需要匯出？</b>
          <p>
            如果您曾在 <HostCodeList hostnames={LEGACY_HOSTNAMES} />{' '}
            看過書，而且想保留閱讀紀錄和下載的章節，就需要進行匯出。如果您已經在{' '}
            <code>{CANONICAL_HOSTNAME}</code> 開始使用了，就不需要匯出囉。
          </p>
        </StepCard>

        <StepCard>
          <b>第一步：在舊站下載備份</b>
          <ol>
            <li>
              請先回到您<strong>原本看書</strong>的舊站（
              <HostCodeList hostnames={LEGACY_HOSTNAMES} />）。
            </li>
            <li>進入本頁（<code>/export</code>）或從首頁點擊「前往匯出資料」。</li>
            <li>點擊下方的「匯出資料」，瀏覽器會下載一個 <code>.fanqie-backup</code> 的備份檔。</li>
          </ol>
          {!onLegacySite && (
            <Hint>
              提醒您：您目前不在舊站喔！請先回到原本看書的網址再匯出，否則只會備份到目前的空資料。
            </Hint>
          )}
          <ActionRow>
            <GrayButton type="button" onClick={handleExport} disabled={exporting}>
              {exporting ? '打包中…' : '匯出資料'}
            </GrayButton>
          </ActionRow>
        </StepCard>

        <StepCard>
          <b>第二步：到新站匯入</b>
          <ol>
            <li>
              前往新站{' '}
              <a href={CANONICAL_SITE_URL} target="_blank" rel="noopener noreferrer">
                {CANONICAL_HOSTNAME}
              </a>
              {' '}的匯入頁面。
            </li>
            <li>上傳剛剛下載的 <code>.fanqie-backup</code> 檔案。</li>
            <li>匯入成功後，重新整理書架就可以繼續看書囉！</li>
          </ol>
          <ActionRow>
            <GrayButton
              type="button"
              onClick={() => window.open(CANONICAL_IMPORT_URL, '_blank', 'noopener,noreferrer')}
            >
              前往 {CANONICAL_HOSTNAME} 匯入
            </GrayButton>
          </ActionRow>
        </StepCard>
      </Section>
    </PageContent>
  );
}

export default ExportContent;
