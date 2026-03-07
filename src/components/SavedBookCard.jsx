import React from 'react';
import styled, { keyframes } from 'styled-components';
import { List, Loader2, MessageCircle, RefreshCw, Trash2 } from 'lucide-react';
import Info from './Info';
import { useBookLoader } from '../hooks/useBookLoader';

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
  border-radius: 20px;
  background-color: var(--background-color2);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  pointer-events: ${(p) => (p.$disabled ? 'none' : 'auto')};
  opacity: ${(p) => (p.$disabled ? 0.7 : 1)};

  &:hover {
    transform: translateY(-4px);
    border-color: var(--accent-color);
    background-color: var(--hover-background-color);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }

  .action-hint {
    position: absolute;
    right: 20px;
    bottom: 20px;
    background: var(--accent-color);
    color: #000;
    padding: 6px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.3s ease;
  }

  &:hover .action-hint {
    opacity: 1;
    transform: translateX(0);
  }
`;

const SpinningIcon = styled.span`
  display: flex;
  animation: ${spin} 1s linear infinite;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  z-index: 10;

  svg {
    width: 40px;
    height: 40px;
    color: var(--accent-color);
    animation: ${spin} 1s linear infinite;
  }
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  align-items: center;
  z-index: 11;
`;

const ActionButton = styled.button`
  padding: 8px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  background-color: ${(p) =>
    p.$variant === 'delete' ? 'rgba(239, 68, 68, 0.9)' : p.$variant === 'comment' ? 'rgba(76, 175, 80, 0.9)' : p.$variant === 'refresh' ? 'rgba(59, 130, 246, 0.9)' : 'rgba(100, 116, 139, 0.9)'};
  color: white;
  opacity: ${(p) => (p.$variant === 'delete' ? 0.7 : 0.9)};

  &:hover {
    opacity: 1;
    background-color: ${(p) =>
      p.$variant === 'delete' ? '#dc2626' : p.$variant === 'comment' ? '#4caf50' : p.$variant === 'refresh' ? '#2563eb' : 'rgba(148, 163, 184, 0.95)'};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
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

function SavedBookCard({ bookId, actionHint, onClick, onCatalogClick, onCommentClick, onRefreshClick, onDeleteClick, useTraditionalChinese }) {
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
        useTraditionalChinese={useTraditionalChinese}
        variant="compact"
      />
      <div className="action-hint">{actionHint}</div>
    </Card>
  );
}

export default SavedBookCard;
