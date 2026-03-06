import React from 'react';
import styled from 'styled-components';
import { BookOpen } from 'lucide-react';
import SavedBookCard from './SavedBookCard';
import { getLastReadChapter, getReadingHistory, safeGetJSON } from '../utils/storage';
import { DIRECTORY_CACHE_KEY, DETAIL_CACHE_KEY } from '../utils/constants';
import { cleanAbstract } from '../utils/text';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

function getBookInfoFromCache(bookId) {
  try {
    const detail = safeGetJSON(`${DETAIL_CACHE_KEY}-${bookId}`);
    return {
      chapterCount: detail?.content_chapter_number || null,
      book_name: detail?.book_name || `書籍 ${bookId.slice(0, 8)}`,
      author: detail?.author || '未知作者',
      abstract: cleanAbstract(detail?.abstract) || null,
      audio_thumb_uri: detail?.audio_thumb_uri || null,
      score: detail?.score || null,
      tags: detail?.tags || null,
      category: detail?.category || null,
      sub_info: detail?.sub_info || null,
    };
  } catch {
    return null;
  }
}

function ReadingHistory({ refreshKey, onBookClick, onCatalogClick, onCommentClick, onDeleteClick, useTraditionalChinese }) {
  const readingHistory = getReadingHistory();

  if (readingHistory.length === 0) {
    return null;
  }

  return (
    <Section key={refreshKey}>
      <SectionTitle><BookOpen /> 閱讀歷史</SectionTitle>
      {readingHistory.map(({ bookId }) => {
        const bookInfo = getBookInfoFromCache(bookId);
        if (!bookInfo) return null;

        const lastReadItemId = getLastReadChapter(bookId);
        const actionHint = lastReadItemId ? '繼續閱讀 →' : '前往目錄 →';

        return (
          <SavedBookCard
            key={bookId}
            bookInfo={bookInfo}
            actionHint={actionHint}
            onClick={() => onBookClick(bookId)}
            onCatalogClick={(e) => onCatalogClick(e, bookId)}
            onCommentClick={(e) => onCommentClick?.(e, bookId)}
            onDeleteClick={(e) => onDeleteClick(e, bookId, bookInfo)}
            useTraditionalChinese={useTraditionalChinese}
          />
        );
      })}
    </Section>
  );
}

export default ReadingHistory;
