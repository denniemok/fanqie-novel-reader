import React from 'react';
import styled from 'styled-components';
import { useConvertedText } from '../../hooks/useConvertedText';
import ActionBar from '../layout/ActionBar';
import NavButtons from '../navigation/NavButtons';
import ReaderSettingsButton from './ReaderSettingsButton';
import { resolveBookDisplay } from '../../utils/book/bookInfo';
import { useBookDisplayVariant } from '../../contexts/BookDisplayVariantContext';

const TopBarWrapper = styled.div`
  display: flex;
  padding: 10px 24px;
  padding-top: calc(10px + env(safe-area-inset-top));
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex-shrink: 0;
  background-color: var(--topbar-bg);
  backdrop-filter: saturate(1.4) blur(20px);
  -webkit-backdrop-filter: saturate(1.4) blur(20px);
  z-index: 1000;
  border-bottom: 1px solid var(--border-color);

  @media (max-width: 480px) {
    padding: 9px 16px;
    padding-top: calc(9px + env(safe-area-inset-top));
    gap: 7px;
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
    font-family: var(--display-font-family);
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.06em;
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
      font-size: 12px;
    }
  }

  h3 {
    color: var(--text-color-secondary);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.06em;
    margin: 2px 0 0 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

/** Stacks two labels in one cell and cross-fades between them, keeping the bar height fixed. */
const SwapLine = styled.span`
  display: grid;
  min-width: 0;

  > span {
    grid-area: 1 / 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: opacity 0.3s ease;
  }

  > span:first-child { opacity: ${(p) => (p.$showSecond ? 0 : 1)}; }
  > span:last-child { opacity: ${(p) => (p.$showSecond ? 1 : 0)}; }
`;

const ProgressBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: stretch;
`;

const ProgressBarContainer = styled.div`
  height: 2px;
  flex: 1;
  border-radius: 999px;
  background-color: var(--border-color);
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background-color: var(--accent-color);
  border-radius: inherit;
  transition: width 0.4s var(--ease-out);
`;

const ProgressText = styled.div`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  font-variant-numeric: tabular-nums;
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
  showChapterTitle = true,
}) {
  const { variant } = useBookDisplayVariant();
  const novelData = chapterData?.novel_data;
  const convertedTitle = useConvertedText(novelData?.title, conversionMode);
  const { book_name: displayBookName } = resolveBookDisplay(bookInfo, variant, bookId);
  const convertedBookName = useConvertedText(displayBookName, conversionMode);
  const convertedAuthor = useConvertedText(bookInfo?.book_info?.author ?? bookInfo?.author, conversionMode);

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
          {bookInfo ? (
            <>
              {/* Book name + author while the in-page chapter heading is visible; chapter + book name after it scrolls away. */}
              <h1>
                <SwapLine $showSecond={showChapterTitle}>
                  <span aria-hidden={showChapterTitle}>{convertedBookName}</span>
                  <span aria-hidden={!showChapterTitle}>{displayTitle}</span>
                </SwapLine>
              </h1>
              <h3>
                <SwapLine $showSecond={showChapterTitle}>
                  <span aria-hidden={showChapterTitle}>{convertedAuthor}</span>
                  <span aria-hidden={!showChapterTitle}>{convertedBookName}</span>
                </SwapLine>
              </h3>
            </>
          ) : (
            <h1>{displayTitle}</h1>
          )}
        </TitleBlock>
        <ActionBar
          pinnedEnd={(
            <PinnedEndGroup>
              <ReaderSettingsButton
                active={readerControlsOpen}
                onToggle={onReaderControlsToggle}
              />
            </PinnedEndGroup>
          )}
        >
          <NavButtons variant="chapter" bookId={bookId} />
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
