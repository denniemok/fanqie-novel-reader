import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Loader2, Download as DownloadIcon, CheckCircle2, CirclePause } from 'lucide-react';
import { useDownloadManager } from '../../contexts/DownloadManager';
import { useToast } from '../../contexts/ToastContext';
import { detailCache } from '../../utils/cache';
import { resolveBookDisplay } from '../../utils/book/bookInfo';
import { isChapterCached, getCatalogSortDirection } from '../../utils/storage';
import { buildCatalogUrl } from '../../utils/navigation';
import ExportBookModalHost from '../export/ExportBookModalHost';
import { useBookDisplayVariant } from '../../contexts/BookDisplayVariantContext';
import { useConvertedText } from '../../hooks/useConvertedText';
import { CardSpinningIcon } from '../book/CardActionButton';
import { GrayButton } from '../ui/GrayButton';
import { SectionTitle } from '../../utils/styled/sections';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin-bottom: 28px;
`;

const StatusCard = styled.div`
  padding: 20px;
  background: var(--card-surface);
  border-radius: var(--border-radius-sm);
  border: var(--retro-border-width) solid var(--border-color);
  box-shadow: var(--retro-shadow);
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const IdleCard = styled(StatusCard)`
  border-style: dashed;
  align-items: center;
  text-align: center;
  padding: 28px 20px;
  color: var(--text-color-secondary);

  svg {
    color: var(--text-color-secondary);
    opacity: 0.7;
  }
`;

const BookRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const BookMeta = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TitleLink = styled.button`
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: 16px;
  font-weight: 600;
  color: var(--accent-color);
  text-align: left;
  cursor: pointer;
  line-height: 1.35;
  text-decoration: underline;
  text-underline-offset: 3px;

  &:hover {
    color: var(--accent-hover);
  }
`;

const TitleText = styled.p`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.35;
`;

const BookId = styled.span`
  font-size: 12px;
  color: var(--text-color-secondary);
  letter-spacing: 0.02em;
`;

const StatusLine = styled.p`
  margin: 0;
  font-size: 14px;
  color: var(--text-color);
  line-height: 1.55;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatItem = styled.div`
  padding: 10px 12px;
  background: var(--background-color2);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-xs);
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatLabel = styled.span`
  font-size: 11px;
  color: var(--text-color-secondary);
  letter-spacing: 0.04em;
`;

const StatValue = styled.span`
  font-size: 18px;
  font-weight: 600;
  font-family: var(--display-font-family);
  color: var(--text-color);
`;

const ProgressTrack = styled.div`
  height: 10px;
  background: var(--background-color2);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-xs);
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${(p) => p.$percent}%;
  background: var(--accent-color);
  transition: width 0.35s ease;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

function DownloadProgress({ conversionMode = 'tw' }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    downloadAllBookId,
    downloadAllItemIds,
    downloading,
    completedDownloads,
    downloadAllStatus,
    queueLength,
    stopDownloadAll,
    resumeDownloadAll,
    dismissDownloadAll,
  } = useDownloadManager();

  const [bookTitle, setBookTitle] = useState(null);
  const [exportBookOpen, setExportBookOpen] = useState(false);
  const { variant: displayVariant } = useBookDisplayVariant();
  const convertedBookTitle = useConvertedText(bookTitle, conversionMode);
  const [progress, setProgress] = useState({ done: 0, total: 0, active: 0 });

  useEffect(() => {
    if (!downloadAllBookId) {
      setBookTitle(null);
      return undefined;
    }

    let cancelled = false;
    detailCache.get(downloadAllBookId).then((detail) => {
      if (!cancelled) {
        const { book_name: title } = resolveBookDisplay(detail, displayVariant, downloadAllBookId);
        setBookTitle(title || downloadAllBookId);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [downloadAllBookId, displayVariant]);

  useEffect(() => {
    if (!downloadAllBookId || downloadAllItemIds.length === 0) {
      setProgress({ done: 0, total: 0, active: 0 });
      return undefined;
    }

    let cancelled = false;
    Promise.all(downloadAllItemIds.map((id) => isChapterCached(id))).then((results) => {
      if (cancelled) return;
      const done = results.filter(Boolean).length;
      const active = downloadAllItemIds.filter((id) => downloading.has(id)).length;
      setProgress({ done, total: downloadAllItemIds.length, active });
    });
    return () => {
      cancelled = true;
    };
  }, [downloadAllBookId, downloadAllItemIds, downloading, completedDownloads]);

  const activeCount = downloading.size;
  const isBatchActive = Boolean(downloadAllBookId);
  const isBatchComplete = downloadAllStatus === 'completed';
  const isBatchStopped = downloadAllStatus === 'stopped';
  const isBatchInProgress = downloadAllStatus === 'active';
  const isAnyActive = activeCount > 0 || queueLength > 0 || isBatchActive;
  const percent = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
  const displayPercent = isBatchComplete ? 100 : percent;
  const waitingCount = Math.max(0, progress.total - progress.done - progress.active);

  if (!isAnyActive) {
    return (
      <Section>
        <SectionTitle>下載狀態</SectionTitle>
        <IdleCard>
          <DownloadIcon size={32} strokeWidth={2} aria-hidden />
          <StatusLine>目前沒有正在下載的書籍喔</StatusLine>
        </IdleCard>
      </Section>
    );
  }

  return (
    <>
      <Section>
        <SectionTitle>下載狀態</SectionTitle>
        <StatusCard>
        {isBatchActive ? (
          <>
            <BookRow>
              {isBatchComplete ? (
                <CheckCircle2 size={22} color="var(--accent-color)" aria-hidden />
              ) : isBatchStopped ? (
                <CirclePause size={22} color="var(--text-color-secondary)" aria-hidden />
              ) : (
                <CardSpinningIcon $duration="1s">
                  <Loader2 size={22} color="var(--accent-color)" aria-hidden />
                </CardSpinningIcon>
              )}
              <BookMeta>
                <TitleLink type="button" onClick={() => navigate(buildCatalogUrl(downloadAllBookId))}>
                  {convertedBookTitle || '載入書名中…'}
                </TitleLink>
                <BookId>ID：{downloadAllBookId}</BookId>
              </BookMeta>
            </BookRow>
            <StatusLine>
              {isBatchComplete
                ? `下載完成 · 共 ${progress.total} 章`
                : isBatchStopped
                  ? `已停止下載 · 已完成 ${progress.done} / ${progress.total} 章（${percent}%）`
                  : `正在下載全書 · 已完成 ${progress.done} / ${progress.total} 章（${percent}%）`}
            </StatusLine>
            <ProgressTrack aria-hidden>
              <ProgressFill $percent={displayPercent} />
            </ProgressTrack>
            <StatGrid>
              <StatItem>
                <StatLabel>已完成</StatLabel>
                <StatValue>{isBatchComplete ? progress.total : progress.done}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>進行中</StatLabel>
                <StatValue>{isBatchInProgress ? progress.active : 0}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>待下載</StatLabel>
                <StatValue>{isBatchInProgress ? waitingCount : isBatchComplete ? 0 : Math.max(0, progress.total - progress.done)}</StatValue>
              </StatItem>
            </StatGrid>
            <ActionRow>
              <GrayButton type="button" onClick={() => navigate(buildCatalogUrl(downloadAllBookId))}>
                前往目錄
              </GrayButton>
              <GrayButton type="button" onClick={() => setExportBookOpen(true)}>
                匯出書籍
              </GrayButton>
              {isBatchInProgress ? (
                <GrayButton type="button" onClick={stopDownloadAll}>
                  停止下載
                </GrayButton>
              ) : (
                <>
                  {isBatchStopped && (
                    <GrayButton type="button" onClick={resumeDownloadAll}>
                      繼續下載
                    </GrayButton>
                  )}
                  <GrayButton type="button" onClick={dismissDownloadAll}>
                    清除記錄
                  </GrayButton>
                </>
              )}
            </ActionRow>
          </>
        ) : (
          <>
            <BookRow>
              <CardSpinningIcon $duration="1s">
                <Loader2 size={22} color="var(--accent-color)" aria-hidden />
              </CardSpinningIcon>
              <BookMeta>
                <TitleText>手動章節下載</TitleText>
                <BookId>這是您手動點擊的單章下載</BookId>
              </BookMeta>
            </BookRow>
            <StatusLine>
              正在下載 {activeCount} 個章節
              {queueLength > 0 ? `，還有 ${queueLength} 章在排隊喔` : ''}
            </StatusLine>
          </>
        )}

        {!isBatchActive && (activeCount > 0 || queueLength > 0) && (
          <StatGrid>
            <StatItem>
              <StatLabel>進行中</StatLabel>
              <StatValue>{activeCount}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>佇列中</StatLabel>
              <StatValue>{queueLength}</StatValue>
            </StatItem>
          </StatGrid>
        )}
      </StatusCard>
    </Section>
    <ExportBookModalHost
      open={exportBookOpen}
      bookId={downloadAllBookId}
      defaultSortOrder={getCatalogSortDirection()}
      defaultConversionMode={conversionMode}
      defaultDisplayVariant={displayVariant}
      showToast={showToast}
      onClose={() => setExportBookOpen(false)}
    />
    </>
  );
}

export default DownloadProgress;
