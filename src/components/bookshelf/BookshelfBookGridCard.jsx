import React from 'react';
import styled from 'styled-components';
import { GripHorizontal, Loader2, Check } from 'lucide-react';
import { useBookshelfBookCard } from '../../hooks/bookshelf/useBookshelfBookCard';
import { useConvertedText } from '../../hooks/useConvertedText';
import { resolveBookDisplay } from '../../utils/book/bookInfo';
import { useBookDisplayVariant } from '../../contexts/BookDisplayVariantContext';
import { shimmerStyle } from '../../utils/styled/animations';
import { bookCardSurface, bookCardCoverZoom, bookCoverImage, coverMetaBadge, bookCardTitle, bookCardAuthor } from '../../utils/styled/bookCard';
import { getCoverMetaEntries } from '../../utils/coverMetaLines';
import { CardLoadingOverlay, CardActionButton } from '../book/CardActionButton';
import BookCoverImg from '../book/BookCoverImg';
import BookRefreshError from '../book/BookRefreshError';
import { BookQuickActions } from '../book/BookQuickActions';
import {
  CardActionBarScroll,
  CardActionBarScrollInner,
  CardActionFooter,
  cardActionBarHandlers,
} from '../layout/CardActionBarLayout';

const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background-color: var(--card-surface);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
`;

const SkeletonCover = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  ${shimmerStyle}
`;

const SkeletonText = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SkeletonLine = styled.div`
  height: ${(p) => p.$height || '12px'};
  width: ${(p) => p.$width || '100%'};
  ${shimmerStyle}
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  ${bookCardSurface}
  ${bookCardCoverZoom}
  cursor: pointer;
  position: relative;
  overflow: hidden;
  opacity: ${(p) => (p.$disabled ? 0.7 : 1)};
  pointer-events: ${(p) => (p.$disabled ? 'none' : 'auto')};

  ${(p) => p.$selected && `
    border-color: var(--accent-color);
    box-shadow: 0 0 0 1px var(--accent-color);
  `}

  ${(p) => p.$isDragging && `
    outline: 1px dashed var(--accent-color);
    outline-offset: -4px;
  `}
`;

const DragHandleTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 28px;
  background: transparent;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color-secondary);
  touch-action: none;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;

  &:active {
    cursor: grabbing;
    color: var(--accent-color);
    background: var(--hover-background-color);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CoverWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const CoverImg = styled.img`
  ${bookCoverImage}
`;

const CoverPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  background-color: var(--cover-bg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--text-color-secondary);
`;

const CoverMetaOverlayBottom = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  max-width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  pointer-events: none;
`;

const CoverMetaLine = styled.div`
  ${coverMetaBadge}
`;

const Info = styled.div`
  padding: 12px 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-sizing: border-box;
`;

const Title = styled.div`
  ${bookCardTitle}
`;

const Author = styled.div`
  ${bookCardAuthor}
  opacity: ${(p) => (p.$empty ? 0 : 1)};
`;

const SelectionBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 11;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid ${(p) => (p.$selected ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.9)')};
  background: ${(p) => (p.$selected ? 'var(--accent-color)' : 'rgba(20, 18, 16, 0.35)')};
  color: var(--text-on-accent);
  pointer-events: none;

  svg {
    width: 12px;
    height: 12px;
    opacity: ${(p) => (p.$selected ? 1 : 0)};
  }
`;

const GridCardActionButton = styled(CardActionButton).attrs({ $compact: true })``;

const GridActionFooter = styled(CardActionFooter)`
  width: 100%;
  box-sizing: border-box;
  padding: 4px 8px;

  ${CardActionBarScrollInner} {
    width: 100%;
    justify-content: flex-start;
    padding: 2px 0 4px;
  }
`;

function BookshelfBookGridCard({
  bookId,
  onClick,
  onRefreshClick,
  onDeleteClick,
  onDeleteLocalDataClick,
  onAddToCollection,
  onDownload,
  onExport,
  isAllTab = true,
  conversionMode,
  sortBy = 'manual',
  dragHandleProps,
  isDragging,
  canClick,
  reorderMode,
  selectionMode = false,
  isSelected = false,
  onToggleSelect,
  bulkRefreshing = false,
  refreshError,
  bookDataVersion = 0,
  showActions = false,
}) {
  const {
    bookInfo,
    isLoading,
    isRefreshing,
    handleCardClick,
    showItemActions,
    actionProps,
  } = useBookshelfBookCard({
    bookId,
    bookDataVersion,
    bulkRefreshing,
    reorderMode,
    selectionMode,
    onToggleSelect,
    canClick,
    onClick,
    showActions,
    isAllTab,
    onAddToCollection,
    onDownload,
    onExport,
    onRefreshClick,
    onDeleteClick,
    onDeleteLocalDataClick,
  });
  const { variant } = useBookDisplayVariant();

  const bookInfoData = bookInfo?.book_info || bookInfo || {};
  const { book_name, thumb_url, fallback_thumb_url } = resolveBookDisplay(bookInfoData, variant, bookId);
  const {
    author,
    word_number,
    score,
    last_publish_time,
    category,
  } = bookInfoData;

  const convertedName = useConvertedText(book_name, conversionMode);
  const convertedAuthor = useConvertedText(author, conversionMode);
  const convertedWordCount = useConvertedText(word_number, conversionMode);
  const convertedCategory = useConvertedText(category, conversionMode);
  const chapter_count = bookInfo?.chapter_count ?? null;

  const coverMetaLines = getCoverMetaEntries(sortBy, {
    score,
    lastPublishTime: last_publish_time,
    wordCount: word_number,
    category,
    chapterCount: chapter_count,
    convertedWordCount,
    convertedCategory,
  });

  const coverOverlayBottom = coverMetaLines.length > 0 && (
    <CoverMetaOverlayBottom>
      {coverMetaLines.map(({ key, text }) => (
        <CoverMetaLine key={key}>{text}</CoverMetaLine>
      ))}
    </CoverMetaOverlayBottom>
  );

  if (isLoading && !bookInfo) {
    return (
      <SkeletonCard>
        <SkeletonCover />
        <SkeletonText>
          <SkeletonLine $height="13px" $width="90%" />
          <SkeletonLine $height="11px" $width="60%" />
        </SkeletonText>
      </SkeletonCard>
    );
  }

  if (!bookInfo) {
    return null;
  }

  return (
    <Card
      onClick={handleCardClick}
      $disabled={isRefreshing}
      $isDragging={isDragging}
      $still={reorderMode || isDragging}
      $selected={selectionMode && isSelected}
    >
      {isRefreshing && (
        <CardLoadingOverlay $iconSize={28}>
          <Loader2 />
        </CardLoadingOverlay>
      )}

      {dragHandleProps && (
        <DragHandleTop {...dragHandleProps} aria-label="拖曳排序">
          <GripHorizontal />
        </DragHandleTop>
      )}

      <CoverWrapper>
        <BookCoverImg
          url={thumb_url}
          fallbackUrl={fallback_thumb_url}
          ImgComponent={CoverImg}
          Placeholder={CoverPlaceholder}
          alt="書籍封面"
        />
        {coverOverlayBottom}
        {selectionMode && (
          <SelectionBadge $selected={isSelected} aria-hidden>
            <Check />
          </SelectionBadge>
        )}
      </CoverWrapper>

      <Info>
        <Title>{convertedName || bookId}</Title>
        <Author $empty={!convertedAuthor}>{convertedAuthor || '\u00A0'}</Author>
      </Info>
      {showItemActions && (
        <GridActionFooter {...cardActionBarHandlers}>
          <CardActionBarScroll>
            <BookQuickActions {...actionProps} ButtonComponent={GridCardActionButton} />
          </CardActionBarScroll>
        </GridActionFooter>
      )}
      <BookRefreshError message={refreshError} />
    </Card>
  );
}

export default BookshelfBookGridCard;
