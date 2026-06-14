import React, { useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { BookmarkPlus, GripVertical, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { useBookLoader } from '../../hooks/useBookLoader';
import { useToast } from '../../contexts/ToastContext';
import { useConvertedText } from '../../hooks/useConvertedText';

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const shimmerStyle = css`
  background: linear-gradient(
    90deg,
    var(--background-color2) 25%,
    var(--border-color) 50%,
    var(--background-color2) 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background-color: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
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
  background-color: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: var(--retro-shadow);
  transition: all 0.1s steps(2);
  opacity: ${(p) => (p.$disabled ? 0.7 : 1)};
  pointer-events: ${(p) => (p.$disabled ? 'none' : 'auto')};

  &:hover {
    border-color: ${(p) => (p.$reorderMode || p.$isDragging ? 'var(--border-color)' : 'var(--accent-color)')};
    background-color: ${(p) => (p.$reorderMode || p.$isDragging ? 'var(--background-color2)' : 'var(--hover-background-color)')};
    transform: ${(p) => (p.$reorderMode || p.$isDragging ? 'none' : 'translate(-2px, -2px)')};
    box-shadow: ${(p) => (p.$reorderMode || p.$isDragging ? 'var(--retro-shadow)' : '6px 6px 0px var(--background-color)')};
  }

  &:active {
    transform: ${(p) => (p.$reorderMode || p.$isDragging ? 'none' : 'translate(1px, 1px)')};
    box-shadow: ${(p) => (p.$reorderMode || p.$isDragging ? 'var(--retro-shadow)' : '0px 0px 0px var(--background-color)')};
  }

  ${(p) => p.$isDragging && `
    outline: 2px dashed var(--accent-color);
    outline-offset: -2px;
  `}
`;

const DragHandle = styled.div`
  position: absolute;
  bottom: 6px;
  right: 6px;
  z-index: 12;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  background: var(--background-color2);
  border: 1px solid var(--border-color);
  color: var(--text-color-secondary);
  touch-action: none;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.4);

  &:active {
    cursor: grabbing;
    color: var(--accent-color);
    border-color: var(--accent-color);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const CoverWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const CoverImg = styled.img`
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  opacity: 0.65;
  border-bottom: 1px solid var(--border-color);
  display: block;
`;

const CoverPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--text-color-secondary);
  opacity: 0.5;
`;

const CoverMetaOverlayBottom = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  max-width: calc(100% - 36px);
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
  color: #f0f0f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  max-width: 100%;
  padding: 3px 6px;
  background: rgba(0, 0, 0, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.12);
`;

const Info = styled.div`
  padding: 8px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-height: 62px;
  box-sizing: border-box;

  @media (max-width: 480px) {
    min-height: 58px;
  }
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: var(--text-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.35;
  min-height: calc(13px * 1.35 * 2);

  @media (max-width: 480px) {
    font-size: 12px;
    min-height: calc(12px * 1.35 * 2);
  }
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

const ActionsOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 11;
  display: flex;
  justify-content: flex-end;
  gap: 4px;
  padding: 6px;
  pointer-events: auto;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.82) 0%, rgba(0, 0, 0, 0.35) 70%, transparent 100%);
`;

const ActionBtn = styled.button`
  padding: 6px;
  border-radius: 0;
  border: 1px solid var(--border-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.1s steps(2);
  background-color: ${(p) =>
    p.$variant === 'delete'
      ? '#aa5555'
      : p.$variant === 'refresh'
        ? '#5588aa'
        : p.$variant === 'collection'
          ? '#aa8833'
          : 'var(--background-color2)'};
  color: #000;
  box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.5);

  &:hover {
    filter: brightness(1.15);
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px rgba(0, 0, 0, 0.6);
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 0px 0px 0px rgba(0, 0, 0, 0.5);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const SpinningIcon = styled.span`
  display: flex;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 10;

  svg {
    width: 28px;
    height: 28px;
    color: var(--accent-color);
    animation: ${spin} 0.8s linear infinite;
  }
`;

function GridCard({
  bookId,
  onClick,
  onDeleteClick,
  onAddToCollection,
  conversionMode,
  sortBy = 'manual',
  dragHandleProps,
  isDragging,
  canClick,
  reorderMode,
  settingsMode = false,
}) {
  const { bookInfo, isLoading, refetch, isRefreshing, error } = useBookLoader(bookId, { detailOnly: true });
  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error);
  }, [error, showToast]);

  const bookInfoData = bookInfo?.book_info || bookInfo || {};
  const {
    original_book_name,
    author,
    audio_thumb_uri,
    word_number,
    score,
    last_publish_time,
  } = bookInfoData;

  const convertedName = useConvertedText(original_book_name, conversionMode);
  const convertedAuthor = useConvertedText(author, conversionMode);
  const convertedWordCount = useConvertedText(word_number, conversionMode);
  const chapter_count = bookInfo?.chapter_count ?? null;

  const coverMetaLines = (() => {
    switch (sortBy) {
      case 'rating':
        return score ? [<CoverMetaLine key="score">評分 {score}</CoverMetaLine>] : [];
      case 'update':
        return last_publish_time ? [<CoverMetaLine key="update">更新 {last_publish_time}</CoverMetaLine>] : [];
      case 'chapters':
        return [
          <CoverMetaLine key="chapters">
            {chapter_count ? `共 ${chapter_count} 章節` : '暫無章節資訊'}
          </CoverMetaLine>,
        ];
      case 'words':
        return convertedWordCount
          ? [<CoverMetaLine key="words">{convertedWordCount}字</CoverMetaLine>]
          : [];
      default:
        return [];
    }
  })();

  const coverOverlayBottom = coverMetaLines.length > 0 && (
    <CoverMetaOverlayBottom>{coverMetaLines}</CoverMetaOverlayBottom>
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
    if (canClick && !canClick()) return;
    onClick?.();
  };

  return (
    <Card onClick={handleCardClick} $disabled={isRefreshing} $isDragging={isDragging} $reorderMode={reorderMode}>
      {isRefreshing && (
        <LoadingOverlay>
          <Loader2 />
        </LoadingOverlay>
      )}

      <CoverWrapper>
        {audio_thumb_uri ? (
          <CoverImg src={audio_thumb_uri} alt="書籍封面" />
        ) : (
          <CoverPlaceholder>無封面</CoverPlaceholder>
        )}
        {coverOverlayBottom}
        {settingsMode && !reorderMode && (
          <ActionsOverlay>
            {onAddToCollection && (
              <ActionBtn
                type="button"
                $variant="collection"
                onClick={(e) => { e.stopPropagation(); onAddToCollection(bookId); }}
                title="加入收藏夾"
                aria-label="加入收藏夾"
              >
                <BookmarkPlus />
              </ActionBtn>
            )}
            <ActionBtn
              type="button"
              $variant="refresh"
              disabled={isRefreshing}
              onClick={(e) => { e.stopPropagation(); refetch(e); }}
              title="刷新"
              aria-label="刷新"
            >
              {isRefreshing ? <SpinningIcon><Loader2 size={16} /></SpinningIcon> : <RefreshCw />}
            </ActionBtn>
            <ActionBtn
              type="button"
              $variant="delete"
              onClick={(e) => { e.stopPropagation(); onDeleteClick(e, bookId, bookInfo); }}
              title="刪除"
              aria-label="刪除"
            >
              <Trash2 />
            </ActionBtn>
          </ActionsOverlay>
        )}
        {dragHandleProps && (
          <DragHandle {...dragHandleProps} aria-label="拖曳排序">
            <GripVertical />
          </DragHandle>
        )}
      </CoverWrapper>

      <Info>
        <Title>{convertedName || bookId}</Title>
        <Author $empty={!convertedAuthor}>{convertedAuthor || '\u00A0'}</Author>
      </Info>
    </Card>
  );
}

export default GridCard;
