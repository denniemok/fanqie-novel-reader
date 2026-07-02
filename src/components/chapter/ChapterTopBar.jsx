import React from 'react';
import styled from 'styled-components';
import { useConvertedText } from '../../hooks/useConvertedText';
import ActionBar from '../layout/ActionBar';
import BackButton from '../navigation/BackButton';
import ForwardButton from '../navigation/ForwardButton';
import NavButtons from '../navigation/NavButtons';
import SettingsButton from '../settings/SettingsButton';
import ReaderSettingsButton from './ReaderSettingsButton';
import { resolveBookDisplay } from '../../utils/book/bookInfo';
import { useBookDisplayVariant } from '../../contexts/BookDisplayVariantContext';

const TopBarWrapper = styled.div`
  display: flex;
  padding: 16px 24px;
  padding-top: calc(16px + env(safe-area-inset-top));
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  background-color: var(--topbar-bg);
  backdrop-filter: blur(12px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--border-color);

  @media (max-width: 480px) {
    padding: 12px 16px;
    padding-top: calc(12px + env(safe-area-inset-top));
    gap: 10px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  align-self: stretch;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;

  h1 {
    color: var(--text-color);
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 16px;
    }
    h3 {
      font-size: 11px;
    }
  }

  h3 {
    color: var(--text-color-secondary);
    font-size: 12px;
    font-weight: 400;
    margin: 4px 0 0 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ProgressBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: stretch;
`;

const ProgressBarContainer = styled.div`
  height: 4px;
  flex: 1;
  border-radius: 999px;
  background-color: var(--accent-soft);
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background-color: var(--accent-color);
  transition: width 0.1s steps(10);
`;

const ProgressText = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: var(--text-color-secondary);
  min-width: 60px;
  text-align: right;

  .current {
    color: var(--text-color);
  }
`;

const PinnedEndGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 900px) {
    gap: 0;
  }
`;

function ChapterTopBar({
  chapterData,
  bookInfo,
  bookId,
  itemId,
  conversionMode = 'tw',
  readerControlsOpen,
  onReaderControlsToggle,
}) {
  const { variant } = useBookDisplayVariant();
  const novelData = chapterData?.novel_data;
  const convertedTitle = useConvertedText(novelData?.title, conversionMode);
  const { book_name: displayBookName } = resolveBookDisplay(bookInfo, variant, bookId);
  const convertedBookName = useConvertedText(displayBookName, conversionMode);

  if (!chapterData) return null;

  const displayTitle = convertedTitle || (itemId ? `第 ${itemId} 章` : '章節');
  const { order, serial_count } = novelData ?? {};
  const progress = order && serial_count
    ? ((parseInt(order, 10) / parseInt(serial_count, 10)) * 100).toFixed(1)
    : null;

  return (
    <TopBarWrapper>
      <InfoRow>
        <TitleBlock>
          <h1>{displayTitle}</h1>
          {bookInfo && <h3>{convertedBookName}</h3>}
        </TitleBlock>
        <ActionBar
          pinnedStart={
            <>
              <BackButton />
              <ForwardButton />
            </>
          }
          pinnedEnd={(
            <PinnedEndGroup>
              <ReaderSettingsButton
                active={readerControlsOpen}
                onToggle={onReaderControlsToggle}
              />
              <SettingsButton />
            </PinnedEndGroup>
          )}
        >
          <NavButtons />
        </ActionBar>
      </InfoRow>
      {progress != null && (
      <ProgressBox aria-hidden="true">
        <ProgressBarContainer>
          <Progress style={{ width: `${progress}%` }} />
        </ProgressBarContainer>
        <ProgressText>
          <span className="current">{order}</span> / {serial_count}
        </ProgressText>
      </ProgressBox>
      )}
    </TopBarWrapper>
  );
}

export default ChapterTopBar;
