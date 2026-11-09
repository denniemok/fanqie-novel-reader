import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContent from '../layout/PageContent';
import { GrayButton } from '../ui/GrayButton';
import { useToast } from '../../contexts/ToastContext';
import { DATA_BACKUP_EXTENSION } from '../../utils/constants';
import { exportUserData } from '../../utils/dataMigration';
import { ROUTES } from '../../utils/navigation';
import { ActionRow, Section, SectionTitle, StepCard } from './styles';

function ExportContent() {
  const navigate = useNavigate();
  const { notifyError, notifyInfo, notifySuccess } = useToast();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const summary = await exportUserData();
      if (summary.totalKeys === 0) {
        notifyInfo('備份檔已下載，但目前沒有可備份的資料。');
      } else {
        notifySuccess(
          `已匯出備份檔（${summary.chapters} 章節、${summary.directories} 本目錄、${summary.details} 本書籍）。`,
        );
      }
    } catch (err) {
      notifyError(err, '匯出失敗，請稍後再試。');
    } finally {
      setExporting(false);
    }
  };

  return (
    <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
      <Section>
        <SectionTitle>備份資料 — 匯出</SectionTitle>

        <StepCard>
          <b>匯出備份檔</b>
          <p>
            把書架、收藏夾、閱讀紀錄、已下載的章節和替換規則打包成一個 <code>{DATA_BACKUP_EXTENSION}</code> 檔案。
            資料只存在這個瀏覽器，換裝置、換瀏覽器或清除瀏覽資料前，建議先備份一次。
          </p>
          <ActionRow>
            <GrayButton type="button" onClick={handleExport} disabled={exporting}>
              {exporting ? '打包中…' : '匯出資料'}
            </GrayButton>
          </ActionRow>
        </StepCard>

        <StepCard>
          <b>還原備份</b>
          <ol>
            <li>把備份檔傳到要使用的裝置。</li>
            <li>在該裝置打開本站的「匯入資料」頁，上傳備份檔即可。</li>
          </ol>
          <ActionRow>
            <GrayButton type="button" onClick={() => navigate(ROUTES.import)}>
              前往匯入資料
            </GrayButton>
          </ActionRow>
        </StepCard>
      </Section>
    </PageContent>
  );
}

export default ExportContent;
