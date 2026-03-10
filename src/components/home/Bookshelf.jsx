import React from 'react';
import styled from 'styled-components';
import { BookOpen } from 'lucide-react';
import BookCard from './BookCard';
import { getLastReadChapter, getReadingHistory } from '../../utils/storage';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--background-color2);
  padding: 7px 12px;
  border: 1px solid var(--border-color);
  width: fit-content;
  box-shadow: 2px 2px 0px var(--background-color);

  svg {
    width: 16px;
    height: 16px;
  }
`;

function Bookshelf({ refreshKey, onBookClick, onCatalogClick, onCommentClick, onDeleteClick, conversionMode }) {
  const readingHistory = getReadingHistory();

  if (readingHistory.length === 0) {
    return null;
  }

  return (
    <Section key={refreshKey}>
      <SectionTitle><BookOpen /> 閱讀歷史</SectionTitle>
      {readingHistory.map(({ bookId }) => {
        const lastReadItemId = getLastReadChapter(bookId);
        const actionHint = lastReadItemId ? '繼續閱讀 →' : '前往目錄 →';

        return (
          <BookCard
            key={bookId}
            bookId={bookId}
            actionHint={actionHint}
            onClick={() => onBookClick(bookId)}
            onCatalogClick={(e) => onCatalogClick(e, bookId)}
            onCommentClick={(e) => onCommentClick?.(e, bookId)}
            onDeleteClick={onDeleteClick}
            conversionMode={conversionMode}
          />
        );
      })}
    </Section>
  );
}

export default Bookshelf;
