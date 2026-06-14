import React, { useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { GripVertical, Loader2, RefreshCw, Trash2, FolderInput } from 'lucide-react';
import Info from '../book/Info';
import { useBookLoader } from '../../hooks/useBookLoader';
import { useToast } from '../../contexts/ToastContext';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

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

const SkeletonCard = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  gap: 20px;
  border-radius: 0;
  background-color: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  box-shadow: var(--retro-shadow);

  @media (max-width: 480px) {
    padding: 16px;
    gap: 16px;
  }
`;

const SkeletonCover = styled.div`
  width: 100px;
  height: 134px;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
  ${shimmerStyle}

  @media (max-width: 480px) {
    width: 80px;
    height: 107px;
  }
`;

const SkeletonText = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
`;

const SkeletonLine = styled.div`
  height: ${(p) => p.$height || '14px'};
  width: ${(p) => p.$width || '100%'};
  border-radius: 0;
  ${shimmerStyle}
`;

const Card = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: stretch;
  gap: 0;
  border-radius: 0;
  background-color: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  cursor: pointer;
  transition: all 0.1s steps(2);
  position: relative;
  overflow: hidden;
  pointer-events: ${(p) => (p.$disabled ? 'none' : 'auto')};
  opacity: ${(p) => (p.$disabled ? 0.7 : 1)};
  box-shadow: var(--retro-shadow);

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

const CardBody = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  padding: 20px;
  gap: 20px;

  @media (max-width: 480px) {
    padding: 16px;
    gap: 16px;
  }
`;

const DragHandle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 36px;
  align-self: stretch;
  background: var(--background-color);
  border-right: 1px solid var(--border-color);
  color: var(--text-color-secondary);
  touch-action: none;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;

  &:active {
    cursor: grabbing;
    color: var(--accent-color);
    background: var(--background-color2);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 480px) {
    width: 32px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const SpinningIcon = styled.span`
  display: flex;
  will-change: transform;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 0;
  z-index: 10;

  svg {
    width: 40px;
    height: 40px;
    color: var(--accent-color);
    will-change: transform;
    animation: ${spin} 0.8s linear infinite;
  }
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 4px;
  align-items: center;
  z-index: 11;
  pointer-events: auto; /* stay clickable when Card has pointer-events: none during refresh */
`;

const ActionButton = styled.button`
  padding: 8px;
  min-width: 36px;
  min-height: 36px;
  border-radius: 0;
  border: 1px solid var(--border-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s steps(2);
  background-color: ${(p) =>
    p.$variant === 'delete'
      ? '#aa5555'
        : p.$variant === 'refresh'
        ? '#5588aa'
        : p.$variant === 'collection'
          ? '#aa8833'
          : 'var(--background-color2)'};
  color: ${(p) => (p.$variant ? '#000' : 'var(--text-color)')};
  box-shadow: 2px 2px 0px var(--background-color);

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px #000;
    filter: brightness(1.2);
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 0px 0px 0px #000;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

function BookCard({
  bookId,
  onClick,
  onRefreshClick,
  onDeleteClick,
  onAddToCollection,
  conversionMode,
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

  if (!bookInfo) {
    if (isLoading) {
      return (
        <SkeletonCard>
          <SkeletonCover />
          <SkeletonText>
            <SkeletonLine $height="22px" $width="70%" />
            <SkeletonLine $height="14px" $width="40%" />
            <SkeletonLine $height="13px" $width="90%" />
            <SkeletonLine $height="13px" $width="75%" />
            <SkeletonLine $height="20px" $width="50%" />
          </SkeletonText>
        </SkeletonCard>
      );
    }
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
      {dragHandleProps && (
        <DragHandle {...dragHandleProps} aria-label="拖曳排序">
          <GripVertical />
        </DragHandle>
      )}
      {settingsMode && !reorderMode && (
      <ActionButtons>
        {onAddToCollection && (
          <ActionButton
            type="button"
            $variant="collection"
            onClick={(e) => { e.stopPropagation(); onAddToCollection(bookId); }}
            title="加入收藏夾"
            aria-label="加入收藏夾"
          >
            <FolderInput />
          </ActionButton>
        )}
        <ActionButton
          type="button"
          $variant="refresh"
          disabled={isRefreshing}
          onClick={(e) => { e.stopPropagation(); (onRefreshClick ?? refetch)(e); }}
          title="刷新目錄與書籍資料"
          aria-label="刷新目錄與書籍資料"
        >
          {isRefreshing ? <SpinningIcon><Loader2 size={18} /></SpinningIcon> : <RefreshCw />}
        </ActionButton>
        <ActionButton
          type="button"
          $variant="delete"
          onClick={(e) => { e.stopPropagation(); onDeleteClick(e, bookId, bookInfo); }}
          title="刪除此書的本地資料"
          aria-label="刪除此書的本地資料"
        >
          <Trash2 />
        </ActionButton>
      </ActionButtons>
      )}
      <CardBody>
        <Info
          bookInfo={bookInfo}
          conversionMode={conversionMode}
          variant="compact"
        />
      </CardBody>
    </Card>
  );
}

export default BookCard;
