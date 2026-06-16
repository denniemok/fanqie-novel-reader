import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Loader2, Download as DownloadIcon } from 'lucide-react';
import { useDownloadManager } from '../../contexts/DownloadManager';
import { useToast } from '../../contexts/ToastContext';
import { detailCache } from '../../utils/cache';
import { isChapterCached } from '../../utils/storage';
import { buildCatalogUrl } from '../../utils/navigation';
import { runBookTxtExport } from '../../utils/exportBookActions';
import { CardSpinningIcon } from '../common/CardActionButton';
import { GrayButton } from '../common/GrayButton';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin-bottom: 28px;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  font-family: var(--display-font-family);
  letter-spacing: 0.06em;
  color: var(--text-color);
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

function DownloadStatus() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    downloadAllBookId,
    downloadAllItemIds,
    downloading,
    completedDownloads,
    queueLength,
    stopDownloadAll,
  } = useDownloadManager();

  const [bookTitle, setBookTitle] = useState(null);
  const [progress, setProgress] = useState({ done: 0, total: 0, active: 0 });

  useEffect(() => {
    if (!downloadAllBookId) {
      setBookTitle(null);
      return undefined;
    }

    let cancelled = false;
    detailCache.get(downloadAllBookId).then((detail) => {
      if (!cancelled) {
        setBookTitle(detail?.original_book_name || downloadAllBookId);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [downloadAllBookId]);

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
  const isAnyActive = activeCount > 0 || queueLength > 0 || isBatchActive;
  const percent = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;
  const waitingCount = Math.max(0, progress.total - progress.done - progress.active);

  const handleExportTxt = useCallback(() => {
    if (!downloadAllBookId) return;
    runBookTxtExport({ bookId: downloadAllBookId, showToast });
  }, [downloadAllBookId, showToast]);

  if (!isAnyActive) {
    return (
      <Section>
        <SectionTitle>下載狀態</SectionTitle>
        <IdleCard>
          <DownloadIcon size={32} strokeWidth={2} aria-hidden />
          <StatusLine>目前沒有進行中的下載</StatusLine>
        </IdleCard>
      </Section>
    );
  }

  return (
    <Section>
      <SectionTitle>下載狀態</SectionTitle>
      <StatusCard>
        {isBatchActive ? (
          <>
            <BookRow>
              <CardSpinningIcon $duration="1s">
                <Loader2 size={22} color="var(--accent-color)" aria-hidden />
              </CardSpinningIcon>
              <BookMeta>
                <TitleLink type="button" onClick={() => navigate(buildCatalogUrl(downloadAllBookId))}>
                  {bookTitle || '載入書名中…'}
                </TitleLink>
                <BookId>ID：{downloadAllBookId}</BookId>
              </BookMeta>
            </BookRow>
            <StatusLine>
              正在下載全部章節 · 已完成 {progress.done} / {progress.total} 章（{percent}%）
            </StatusLine>
            <ProgressTrack aria-hidden>
              <ProgressFill $percent={percent} />
            </ProgressTrack>
            <StatGrid>
              <StatItem>
                <StatLabel>已完成</StatLabel>
                <StatValue>{progress.done}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>進行中</StatLabel>
                <StatValue>{progress.active}</StatValue>
              </StatItem>
              <StatItem>
                <StatLabel>待下載</StatLabel>
                <StatValue>{waitingCount}</StatValue>
              </StatItem>
            </StatGrid>
            <ActionRow>
              <GrayButton type="button" onClick={() => navigate(buildCatalogUrl(downloadAllBookId))}>
                前往目錄
              </GrayButton>
              <GrayButton type="button" onClick={handleExportTxt}>
                匯出 TXT
              </GrayButton>
              <GrayButton type="button" onClick={stopDownloadAll}>
                停止下載
              </GrayButton>
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
                <BookId>未使用「下載全部」排程</BookId>
              </BookMeta>
            </BookRow>
            <StatusLine>
              正在下載 {activeCount} 個章節
              {queueLength > 0 ? `，另有 ${queueLength} 章在佇列等候` : ''}
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
  );
}

export default DownloadStatus;
