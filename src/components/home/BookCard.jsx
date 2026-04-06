import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { ArrowDown, ArrowUp, Bookmark, Loader2, MessageCircle, RefreshCw, Trash2 } from 'lucide-react';
import Info from '../book/Info';
import { useBookLoader } from '../../hooks/useBookLoader';
import { useToast } from '../../contexts/ToastContext';
import { getLastReadChapter } from '../../utils/storage';
import { buildChapterUrl } from '../../utils/navigation';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const Card = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  gap: 20px;

  @media (max-width: 480px) {
    padding: 16px;
    gap: 16px;
  }
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
    transform: translate(-2px, -2px);
    border-color: var(--accent-color);
    background-color: var(--hover-background-color);
    box-shadow: 6px 6px 0px var(--background-color);
  }

  .action-hint {
    position: absolute;
    right: 10px;
    bottom: 10px;
    background: var(--accent-color);
    color: var(--background-color);
    padding: 4px 8px;
    border-radius: 0;
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    opacity: 0;
    border: 1px solid var(--border-color);
    transition: all 0.1s steps(2);
  }

  &:hover .action-hint {
    opacity: 1;
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
  padding: 6px;
  border-radius: 0;
  border: 1px solid var(--border-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s steps(2);
  background-color: ${(p) =>
    p.$variant === 'delete' ? '#aa5555' : p.$variant === 'comment' ? '#55aa55' : p.$variant === 'refresh' ? '#5588aa' : p.$variant === 'bookmark' ? '#aa8866' : p.$variant === 'reorder' ? '#6688aa' : 'var(--background-color2)'};
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
  actionHint,
  onClick,
  onCommentClick,
  onRefreshClick,
  onDeleteClick,
  conversionMode,
  reorderEnabled,
  canMoveUp,
  canMoveDown,
  onReorderBook,
}) {
  const navigate = useNavigate();
  const { bookInfo, refetch, isRefreshing, error } = useBookLoader(bookId, { detailOnly: true });
  const { showToast } = useToast();

  useEffect(() => {
    if (error) showToast(error);
  }, [error, showToast]);

  const bookmarkItemId = getLastReadChapter(bookId);

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    navigate(buildChapterUrl(bookmarkItemId, bookId));
  };

  if (!bookInfo) return null;

  return (
    <Card onClick={onClick} $disabled={isRefreshing}>
      {isRefreshing && (
        <LoadingOverlay>
          <Loader2 />
        </LoadingOverlay>
      )}
      <ActionButtons>
        {reorderEnabled && onReorderBook && (
          <>
            <ActionButton
              type="button"
              $variant="reorder"
              disabled={!canMoveUp}
              onClick={(e) => {
                e.stopPropagation();
                onReorderBook(bookId, 'up');
              }}
              title="上移"
              aria-label="在閱讀歷史中上移"
            >
              <ArrowUp />
            </ActionButton>
            <ActionButton
              type="button"
              $variant="reorder"
              disabled={!canMoveDown}
              onClick={(e) => {
                e.stopPropagation();
                onReorderBook(bookId, 'down');
              }}
              title="下移"
              aria-label="在閱讀歷史中下移"
            >
              <ArrowDown />
            </ActionButton>
          </>
        )}
        {bookmarkItemId && (
          <ActionButton
            type="button"
            $variant="bookmark"
            onClick={handleBookmarkClick}
            title="章節書籤（上次閱讀）"
            aria-label="前往章節書籤"
          >
            <Bookmark />
          </ActionButton>
        )}
        {onCommentClick && (
          <ActionButton
            type="button"
            $variant="comment"
            onClick={(e) => { e.stopPropagation(); onCommentClick(e); }}
            title="評論"
            aria-label="查看評論"
          >
            <MessageCircle />
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
      <Info
        bookInfo={bookInfo}
        conversionMode={conversionMode}
        variant="compact"
      />
      <div className="action-hint">{actionHint}</div>
    </Card>
  );
}

export default BookCard;
