import React from 'react';
import styled, { css } from 'styled-components';
import { GripVertical, Loader2, Check, RefreshCw, Trash2, FolderInput, Download } from 'lucide-react';
import BookInfo from '../common/BookInfo';
import { useBookLoader } from '../../hooks/useBookLoader';
import { useErrorToast } from '../../hooks/useErrorToast';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { shimmerStyle } from '../../utils/styled/animations';
import { CardActionButton, CardSpinningIcon, CardLoadingOverlay } from '../common/CardActionButton';
import BookRefreshError from './BookRefreshError';

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
    width: 96px;
    height: 128px;
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
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  align-items: stretch;
  gap: 0;
  border-radius: var(--border-radius-sm);
  background: var(--card-surface);
  border: var(--retro-border-width) solid ${(p) => (p.$selected ? 'var(--accent-color)' : 'var(--border-color)')};
  cursor: pointer;
  transition: var(--transition-default);
  position: relative;
  overflow: hidden;
  pointer-events: ${(p) => (p.$disabled ? 'none' : 'auto')};
  opacity: ${(p) => (p.$disabled ? 0.7 : 1)};
  box-shadow: ${(p) => (p.$selected ? '0 0 0 2px color-mix(in srgb, var(--accent-color) 35%, transparent)' : 'var(--retro-shadow)')};

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: var(--accent-color);
    opacity: ${(p) => (p.$selected ? 1 : 0)};
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

const CardMainRow = styled.div`
  display: flex;
  align-items: stretch;
  flex: 1;
  min-width: 0;
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

const actionBarStyles = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 11;
  pointer-events: auto;
  overflow: visible;
`;

const ActionBarScroll = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  align-items: center;
  justify-content: flex-end;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding: 4px 5px 6px 4px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ActionButtonsOverlay = styled.div`
  ${actionBarStyles}
  position: absolute;
  top: 10px;
  right: 10px;
  max-width: calc(100% - 20px);
`;

const ActionFooter = styled.div`
  ${actionBarStyles}
  flex-shrink: 0;
  padding: 6px 10px 6px;
  border-top: 1px solid var(--border-color);
  background: var(--background-color);
`;

const SelectionBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 11;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${(p) => (p.$selected ? 'var(--accent-color)' : 'var(--border-color)')};
  background: ${(p) => (p.$selected ? 'var(--accent-color)' : 'var(--background-color2)')};
  color: var(--text-on-accent);
  pointer-events: none;

  svg {
    width: 14px;
    height: 14px;
    opacity: ${(p) => (p.$selected ? 1 : 0)};
  }
`;

function ListCardActions({
  bookId,
  bookInfo,
  isAllTab,
  isRefreshing,
  onAddToCollection,
  onDownload,
  onRefreshClick,
  refetch,
  onDeleteClick,
}) {
  return (
    <>
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
      {onDownload && (
        <CardActionButton
          type="button"
          $variant="download"
          onClick={(e) => { e.stopPropagation(); onDownload(bookId); }}
          title="下載全部"
          aria-label="下載全部"
        >
          <Download />
        </CardActionButton>
      )}
      <CardActionButton
        type="button"
        $variant="refresh"
        disabled={isRefreshing}
        onClick={(e) => { e.stopPropagation(); (onRefreshClick ?? refetch)(e, bookId); }}
        title="刷新目錄與書籍資料"
        aria-label="刷新目錄與書籍資料"
      >
        {isRefreshing ? <CardSpinningIcon><Loader2 size={18} /></CardSpinningIcon> : <RefreshCw />}
      </CardActionButton>
      <CardActionButton
        type="button"
        $variant="delete"
        onClick={(e) => { e.stopPropagation(); onDeleteClick?.(e, bookId, bookInfo); }}
        title={isAllTab ? '刪除此書的本地資料' : '從收藏夾移除'}
        aria-label={isAllTab ? '刪除此書的本地資料' : '從收藏夾移除'}
      >
        <Trash2 />
      </CardActionButton>
    </>
  );
}

function ListCard({
  bookId,
  onClick,
  onRefreshClick,
  onDeleteClick,
  onAddToCollection,
  onDownload,
  isAllTab = true,
  conversionMode,
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
  const { bookInfo, isLoading, refetch, isRefreshing: hookRefreshing, error } = useBookLoader(bookId, {
    detailOnly: true,
    bookDataVersion,
  });
  const isRefreshing = hookRefreshing || bulkRefreshing;
  const isMobile = useMediaQuery('(max-width: 480px)');
  useErrorToast(error);

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
    if (selectionMode) {
      onToggleSelect?.();
      return;
    }
    if (canClick && !canClick()) return;
    onClick?.();
  };

  const showItemActions = showActions && !selectionMode && !reorderMode;
  const actionProps = {
    bookId,
    bookInfo,
    isAllTab,
    isRefreshing,
    onAddToCollection,
    onDownload,
    onRefreshClick,
    refetch,
    onDeleteClick,
  };
  const actionBarHandlers = {
    onClick: (e) => e.stopPropagation(),
    onTouchStart: (e) => e.stopPropagation(),
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
        <CardLoadingOverlay>
          <Loader2 />
        </CardLoadingOverlay>
      )}
      <CardMainRow>
        {dragHandleProps && (
          <DragHandle {...dragHandleProps} aria-label="拖曳排序">
            <GripVertical />
          </DragHandle>
        )}
        {selectionMode && (
          <SelectionBadge $selected={isSelected} aria-hidden>
            <Check />
          </SelectionBadge>
        )}
        {showItemActions && !isMobile && (
          <ActionButtonsOverlay {...actionBarHandlers}>
            <ActionBarScroll>
              <ListCardActions {...actionProps} />
            </ActionBarScroll>
          </ActionButtonsOverlay>
        )}
        <CardBody>
          <BookInfo
            bookInfo={bookInfo}
            conversionMode={conversionMode}
            variant="compact"
          />
        </CardBody>
      </CardMainRow>
      {showItemActions && isMobile && (
        <ActionFooter {...actionBarHandlers}>
          <ActionBarScroll>
            <ListCardActions {...actionProps} />
          </ActionBarScroll>
        </ActionFooter>
      )}
      <BookRefreshError message={refreshError} />
    </Card>
  );
}

export default ListCard;
