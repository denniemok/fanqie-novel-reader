import React from 'react';
import styled, { keyframes } from 'styled-components';
import { List, Loader2, MessageCircle, RefreshCw, Trash2 } from 'lucide-react';
import Info from '../book/Info';
import { useBookLoader } from '../../hooks/useBookLoader';

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
  animation: ${spin} 1s steps(8) infinite;
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
    animation: ${spin} 1s steps(8) infinite;
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
    p.$variant === 'delete' ? '#aa5555' : p.$variant === 'comment' ? '#55aa55' : p.$variant === 'refresh' ? '#5588aa' : p.$variant === 'catalog' ? '#aa55aa' : 'var(--background-color2)'};
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

function BookCard({ bookId, actionHint, onClick, onCatalogClick, onCommentClick, onRefreshClick, onDeleteClick, conversionMode }) {
  const { bookInfo, refetch, isRefreshing } = useBookLoader(bookId, { detailOnly: true });

  if (!bookInfo) return null;

  return (
    <Card onClick={onClick} $disabled={isRefreshing}>
      {isRefreshing && (
        <LoadingOverlay>
          <Loader2 />
        </LoadingOverlay>
      )}
      <ActionButtons>
        <ActionButton
          type="button"
          $variant="catalog"
          onClick={(e) => { e.stopPropagation(); onCatalogClick(e); }}
          title="目錄"
          aria-label="前往目錄"
        >
          <List />
        </ActionButton>
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
          title="重新整理"
          aria-label="重新整理"
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
