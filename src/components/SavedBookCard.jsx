import React from 'react';
import styled from 'styled-components';
import { List, MessageCircle, Trash2 } from 'lucide-react';
import { useConvertedText } from '../hooks/useConvertedText';

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

  &:hover {
    transform: translateY(-4px);
    border-color: var(--accent-color);
    background-color: var(--hover-background-color);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }

  img {
    width: 100px;
    height: 134px;
    border-radius: 12px;
    object-fit: cover;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
  }

  .title {
    font-size: 20px;
    font-weight: 700;
    color: var(--text-color);
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .author {
    font-size: 14px;
    color: var(--accent-color);
    font-weight: 500;
  }

  .meta-row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 4px;
  }

  .meta-tag {
    display: inline-flex;
    align-items: center;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 500;
    background-color: rgba(var(--accent-color-rgb, 255, 193, 7), 0.15);
    color: var(--text-color);
    white-space: nowrap;
  }

  .meta-score {
    background-color: rgba(129, 199, 132, 0.3);
    color: #81c784;
  }

  .meta-category {
    background-color: rgba(100, 181, 246, 0.3);
    color: #64b5f6;
  }

  .meta-subinfo {
    background-color: rgba(186, 104, 200, 0.3);
    color: #ba68c8;
  }

  .tags {
    font-size: 12px;
    color: var(--text-color-secondary);
    line-height: 1.3;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    opacity: 0.75;

    @media (max-width: 480px) {
      font-size: 11px;
    }
  }

  .abstract {
    font-size: 13px;
    color: var(--text-color-secondary);
    line-height: 1.5;
    margin-top: 2px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    opacity: 0.8;
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

const ThumbnailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  align-items: center;
`;

const ThumbnailMeta = styled.div`
  font-size: 11px;
  color: var(--text-color-secondary);
  text-align: center;
  width: 100px;
`;

const ActionButtons = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  align-items: center;
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
    p.$variant === 'delete' ? 'rgba(239, 68, 68, 0.9)' : p.$variant === 'comment' ? 'rgba(76, 175, 80, 0.9)' : 'rgba(100, 116, 139, 0.9)'};
  color: white;
  opacity: ${(p) => (p.$variant === 'delete' ? 0.7 : 0.9)};

  &:hover {
    opacity: 1;
    background-color: ${(p) =>
      p.$variant === 'delete' ? '#dc2626' : p.$variant === 'comment' ? '#4caf50' : 'rgba(148, 163, 184, 0.95)'};
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

function SavedBookCard({ bookInfo, actionHint, onClick, onCatalogClick, onCommentClick, onDeleteClick, useTraditionalChinese }) {
  const bookName = useConvertedText(bookInfo.book_name, useTraditionalChinese);
  const author = useConvertedText(bookInfo.author, useTraditionalChinese);
  const abstract = useConvertedText(bookInfo.abstract, useTraditionalChinese);
  const tags = useConvertedText(bookInfo.tags, useTraditionalChinese);
  const category = useConvertedText(bookInfo.category, useTraditionalChinese);
  const subInfo = useConvertedText(bookInfo.sub_info, useTraditionalChinese);

  return (
    <Card onClick={onClick}>
      <ActionButtons>
        <ActionButton
          type="button"
          $variant="catalog"
          onClick={onCatalogClick}
          title="目錄"
          aria-label="前往目錄"
        >
          <List />
        </ActionButton>
        {onCommentClick && (
          <ActionButton
            type="button"
            $variant="comment"
            onClick={onCommentClick}
            title="評論"
            aria-label="查看評論"
          >
            <MessageCircle />
          </ActionButton>
        )}
        <ActionButton
          type="button"
          $variant="delete"
          onClick={onDeleteClick}
          title="刪除此書的本地資料"
          aria-label="刪除此書的本地資料"
        >
          <Trash2 />
        </ActionButton>
      </ActionButtons>
      <ThumbnailWrapper>
        {bookInfo.audio_thumb_uri && (
          <img src={bookInfo.audio_thumb_uri} alt="封面" />
        )}
        <ThumbnailMeta>
          {bookInfo.chapterCount ? `共 ${bookInfo.chapterCount} 章節` : '暫無章節資訊'}
        </ThumbnailMeta>
      </ThumbnailWrapper>
      <div className="content">
        <h3 className="title">{bookName}</h3>
        <div className="author">{author}</div>
        {bookInfo.tags && <div className="tags">{tags}</div>}
        {bookInfo.abstract && <div className="abstract">{abstract}</div>}
        <div className="meta-row">
          {bookInfo.score && <span className="meta-tag meta-score">評分: {bookInfo.score}</span>}
          {bookInfo.category && <span className="meta-tag meta-category">{category}</span>}
          {bookInfo.sub_info && <span className="meta-tag meta-subinfo">{subInfo}</span>}
        </div>
      </div>
      <div className="action-hint">{actionHint}</div>
    </Card>
  );
}

export default SavedBookCard;
