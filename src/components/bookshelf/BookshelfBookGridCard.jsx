import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GripHorizontal, Loader2, Check } from 'lucide-react';
import { useBookLoader } from '../../hooks/book/useBookLoader';
import { useErrorToast } from '../../hooks/useErrorToast';
import { useConvertedText } from '../../hooks/useConvertedText';
import { resolveBookDisplay } from '../../utils/book/bookInfo';
import { useBookDisplayVariant } from '../../contexts/BookDisplayVariantContext';
import { shimmerStyle } from '../../utils/styled/animations';
import { getCoverMetaEntries } from '../../utils/coverMetaLines';
import { CardLoadingOverlay } from '../book/CardActionButton';
import BookCoverImg from '../book/BookCoverImg';
import BookRefreshError from '../book/BookRefreshError';

const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background-color: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  box-shadow: var(--retro-shadow);
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
  background: var(--card-surface);
  border: var(--retro-border-width) solid ${(p) => (p.$selected ? 'var(--accent-color)' : 'var(--border-color)')};
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: ${(p) => (p.$selected ? '0 0 0 2px color-mix(in srgb, var(--accent-color) 35%, transparent)' : 'var(--retro-shadow)')};
  transition: var(--transition-default);
  opacity: ${(p) => (p.$disabled ? 0.7 : 1)};
  pointer-events: ${(p) => (p.$disabled ? 'none' : 'auto')};

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, var(--accent-soft) 0%, transparent 55%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
  }

  &:hover {
    border-color: ${(p) => (p.$reorderMode || p.$isDragging ? 'var(--border-color)' : 'var(--accent-color)')};
    background-color: ${(p) => (p.$reorderMode || p.$isDragging ? 'var(--background-color2)' : 'var(--hover-background-color)')};
    transform: ${(p) => (p.$reorderMode || p.$isDragging ? 'none' : 'translate(-2px, -2px)')};
    box-shadow: ${(p) => (p.$reorderMode || p.$isDragging ? 'var(--retro-shadow)' : 'var(--retro-shadow-hover)')};

    &::after {
      opacity: ${(p) => (p.$reorderMode || p.$isDragging ? 0 : 0.5)};
    }
  }

  &:active {
    transform: ${(p) => (p.$reorderMode || p.$isDragging ? 'none' : 'translate(1px, 1px)')};
    box-shadow: ${(p) => (p.$reorderMode || p.$isDragging ? 'var(--retro-shadow)' : 'none')};
  }

  ${(p) => p.$isDragging && `
    outline: 2px dashed var(--accent-color);
    outline-offset: -2px;
  `}
`;

const DragHandleTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  height: 28px;
  background: var(--background-color2);
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color-secondary);
  touch-action: none;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;

  &:active {
    cursor: grabbing;
    color: var(--accent-color);
    background: var(--background-color);
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

  &:hover img {
    transform: scale(1.03);
  }
`;

const CoverImg = styled.img`
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  background-color: var(--cover-bg);
  opacity: 0.9;
  border-bottom: 1px solid var(--border-color);
  display: block;
  transition: transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1);
`;

const CoverPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  background-color: var(--cover-bg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--text-color-secondary);
`;

const CoverMetaOverlayBottom = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  max-width: 100%;
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  pointer-events: none;
`;

const CoverMetaLine = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: var(--text-on-accent);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  width: fit-content;
  max-width: 100%;
  box-sizing: border-box;
  padding: 3px 6px;
  background: rgba(201, 128, 154, 0.85);
  border: 1px solid rgba(255, 248, 245, 0.4);
`;

const Info = styled.div`
  padding: 8px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-height: 62px;
  box-sizing: border-box;
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 600;
  font-family: var(--display-font-family);
  color: var(--text-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.35;
  min-height: calc(13px * 1.35 * 2);
`;

const Author = styled.div`
  font-size: 11px;
  color: var(--accent-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: ${(p) => (p.$empty ? 0 : 0.85)};
  min-height: 11px;
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
  border: 2px solid ${(p) => (p.$selected ? 'var(--accent-color)' : 'var(--border-color)')};
  background: ${(p) => (p.$selected ? 'var(--accent-color)' : 'rgba(240, 233, 228, 0.92)')};
  color: var(--text-on-accent);
  pointer-events: none;
  box-shadow: var(--retro-shadow);

  svg {
    width: 12px;
    height: 12px;
    opacity: ${(p) => (p.$selected ? 1 : 0)};
  }
`;

function BookshelfBookGridCard({
  bookId,
  onClick,
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
}) {
  const { bookInfo, isLoading, isRefreshing: hookRefreshing, error } = useBookLoader(bookId, {
    detailOnly: true,
    bookDataVersion,
  });
  const isRefreshing = hookRefreshing || bulkRefreshing;
  useErrorToast(error);
  const { variant } = useBookDisplayVariant();

  const bookInfoData = bookInfo?.book_info || bookInfo || {};
  const { book_name, thumb_url } = resolveBookDisplay(bookInfoData, variant, bookId);
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
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [thumb_url, variant]);

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

  const handleCardClick = () => {
    if (reorderMode) return;
    if (selectionMode) {
      onToggleSelect?.();
      return;
    }
    if (canClick && !canClick()) return;
    onClick?.();
  };

  return (
    <Card
      onClick={handleCardClick}
      $disabled={isRefreshing}
      $isDragging={isDragging}
      $reorderMode={reorderMode}
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
        {thumb_url && !imgError ? (
          <BookCoverImg
            url={thumb_url}
            ImgComponent={CoverImg}
            Placeholder={CoverPlaceholder}
            alt="書籍封面"
            onFailed={() => setImgError(true)}
          />
        ) : (
          <CoverPlaceholder>無封面</CoverPlaceholder>
        )}
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
      <BookRefreshError message={refreshError} />
    </Card>
  );
}

export default BookshelfBookGridCard;
