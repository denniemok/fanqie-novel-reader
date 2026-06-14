import React, { useEffect } from 'react';
import styled from 'styled-components';
import { GripVertical, Loader2, RefreshCw, Trash2, FolderInput } from 'lucide-react';
import Info from '../book/Info';
import { useBookLoader } from '../../hooks/useBookLoader';
import { useToast } from '../../contexts/ToastContext';
import { shimmerStyle } from '../../utils/styled/animations';
import { CardActionButton, CardSpinningIcon, CardLoadingOverlay } from './CardActionButton';

const SkeletonCard = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  gap: 20px;
  border-radius: var(--border-radius-sm);
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
  background-color: var(--cover-bg);
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
  border-radius: var(--border-radius-sm);
  ${shimmerStyle}
`;

const Card = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  align-items: stretch;
  gap: 0;
  border-radius: var(--border-radius-sm);
  background: var(--card-surface);
  border: var(--retro-border-width) solid var(--border-color);
  cursor: pointer;
  transition: var(--transition-default);
  position: relative;
  overflow: hidden;
  pointer-events: ${(p) => (p.$disabled ? 'none' : 'auto')};
  opacity: ${(p) => (p.$disabled ? 0.7 : 1)};
  box-shadow: var(--retro-shadow);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--accent-color);
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  &:hover {
    border-color: ${(p) => (p.$reorderMode || p.$isDragging ? 'var(--border-color)' : 'var(--accent-color)')};
    background-color: ${(p) => (p.$reorderMode || p.$isDragging ? 'var(--background-color2)' : 'var(--hover-background-color)')};
    transform: ${(p) => (p.$reorderMode || p.$isDragging ? 'none' : 'translate(-2px, -2px)')};
    box-shadow: ${(p) => (p.$reorderMode || p.$isDragging ? 'var(--retro-shadow)' : 'var(--retro-shadow-hover)')};

    &::before {
      opacity: ${(p) => (p.$reorderMode || p.$isDragging ? 0 : 1)};
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
        <CardLoadingOverlay>
          <Loader2 />
        </CardLoadingOverlay>
      )}
      {dragHandleProps && (
        <DragHandle {...dragHandleProps} aria-label="拖曳排序">
          <GripVertical />
        </DragHandle>
      )}
      {settingsMode && !reorderMode && (
      <ActionButtons>
        {onAddToCollection && (
          <CardActionButton
            type="button"
            $variant="collection"
            onClick={(e) => { e.stopPropagation(); onAddToCollection(bookId); }}
            title="加入收藏夾"
            aria-label="加入收藏夾"
          >
            <FolderInput />
          </CardActionButton>
        )}
        <CardActionButton
          type="button"
          $variant="refresh"
          disabled={isRefreshing}
          onClick={(e) => { e.stopPropagation(); (onRefreshClick ?? refetch)(e); }}
          title="刷新目錄與書籍資料"
          aria-label="刷新目錄與書籍資料"
        >
          {isRefreshing ? <CardSpinningIcon><Loader2 size={18} /></CardSpinningIcon> : <RefreshCw />}
        </CardActionButton>
        <CardActionButton
          type="button"
          $variant="delete"
          onClick={(e) => { e.stopPropagation(); onDeleteClick(e, bookId, bookInfo); }}
          title="刪除此書的本地資料"
          aria-label="刪除此書的本地資料"
        >
          <Trash2 />
        </CardActionButton>
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
