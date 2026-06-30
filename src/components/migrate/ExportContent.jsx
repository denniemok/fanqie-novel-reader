import { useState } from 'react';
import PageContent from '../common/PageContent';
import { GrayButton } from '../common/GrayButton';
import { useToast } from '../../contexts/ToastContext';
import {
  CANONICAL_IMPORT_URL,
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
        showToast('已匯出備份檔，但目前沒有可遷移的本機資料。');
      } else {
        showToast(
          `已下載備份檔（${summary.chapters} 章節、${summary.directories} 本書目錄、${summary.localStorageKeys} 項設定）。`
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
          <b>誰需要此步驟？</b>
          <p>
            僅限曾在{' '}
            {LEGACY_HOSTNAMES.map((host, index) => (
              <span key={host}>
                {index > 0 ? ' 或 ' : ''}
                <code>{host}</code>
              </span>
            ))}{' '}
            使用過、且本機仍有閱讀紀錄或已下載章節的使用者。若您已在{' '}
            <code>fanqietc.com</code> 開始使用，無需匯出。
          </p>
        </StepCard>

        <StepCard>
          <b>步驟一：在舊網域匯出</b>
          <ol>
            <li>
              開啟您<strong>實際存有資料</strong>的舊站網址（
              <code>fanqietc.pages.dev</code> 或 <code>fqnr.pages.dev</code>）。
            </li>
            <li>進入本頁（<code>/export</code>）或從首頁點擊「遷移資料」。</li>
            <li>點擊下方「匯出資料」，瀏覽器會下載 <code>.fanqie-backup</code> 備份檔。</li>
          </ol>
          {!onLegacySite && (
            <Hint>
              您目前不在舊網域上。請先前往存有資料的舊站再匯出；在此頁匯出只會包含目前網域的資料。
            </Hint>
          )}
          <ActionRow>
            <GrayButton type="button" onClick={handleExport} disabled={exporting}>
              {exporting ? '匯出中…' : '匯出資料'}
            </GrayButton>
          </ActionRow>
        </StepCard>

        <StepCard>
          <b>步驟二：在新網域匯入</b>
          <ol>
            <li>
              前往{' '}
              <a href={CANONICAL_SITE_URL} target="_blank" rel="noopener noreferrer">
                fanqietc.com
              </a>
              的匯入頁面。
            </li>
            <li>上傳剛才下載的 <code>.fanqie-backup</code> 檔案並確認匯入。</li>
            <li>匯入完成後重新整理書架，即可繼續閱讀。</li>
          </ol>
          <ActionRow>
            <GrayButton
              type="button"
              onClick={() => window.open(CANONICAL_IMPORT_URL, '_blank', 'noopener,noreferrer')}
            >
              前往 fanqietc.com 匯入
            </GrayButton>
          </ActionRow>
        </StepCard>
      </Section>
    </PageContent>
  );
}

export default ExportContent;
