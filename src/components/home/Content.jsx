import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { deleteBookData, moveReadingHistoryBook } from '../../utils/storage';
import { useToast } from '../../contexts/ToastContext';
import { useConversionMode } from '../../hooks/useConversionMode';
import { maybeConvert } from '../../utils/zh-convert';
import { buildCatalogUrl, buildCommentsUrl } from '../../utils/navigation';
import { formatErrorMessage } from '../../utils/errors';
import Bookshelf from './Bookshelf';
import AddBook from './AddBook';
import Help from './Help';
import NoticeBoard from './NoticeBoard';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: calc(40px + env(safe-area-inset-top)) 24px calc(40px + env(safe-area-inset-bottom));
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 480px) {
    padding: calc(24px + env(safe-area-inset-top)) 16px calc(24px + env(safe-area-inset-bottom));
  }
`;

function Content() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [conversionMode, setConversionMode] = useConversionMode();

  const goToCatalog = (bookId) => navigate(buildCatalogUrl(bookId));

  const handleBookInputSubmit = goToCatalog;

  const handleBookClick = goToCatalog;

  const handleCommentClick = (e, bookId) => {
    e.stopPropagation();
    navigate(buildCommentsUrl(bookId));
  };

  const handleReorderBook = (bookId, direction) => {
    moveReadingHistoryBook(bookId, direction);
    setRefreshKey((k) => k + 1);
  };

  const handleDeleteBook = async (e, bookId, bookInfo) => {
    e.stopPropagation();
    const bookName = bookInfo?.book_info?.original_book_name;
    const convertedName = maybeConvert(bookName, conversionMode) || bookId;
    if (window.confirm(`確定要刪除「${convertedName}」的所有本地資料嗎？`)) {
      try {
        await deleteBookData(bookId);
        setRefreshKey((k) => k + 1);
      } catch (err) {
        console.error('刪除書籍失敗：', bookId, err);
        showToast(formatErrorMessage(err, '刪除書籍失敗，請稍後再試。'));
      }
    }
  };

  return (
    <ContentWrapper>
      <NoticeBoard />
      <Bookshelf
        refreshKey={refreshKey}
        onBookClick={handleBookClick}
        onCommentClick={handleCommentClick}
        onReorderBook={handleReorderBook}
        onDeleteClick={handleDeleteBook}
        conversionMode={conversionMode}
      />

      <AddBook
        onSubmit={handleBookInputSubmit}
        refreshKey={refreshKey}
        conversionMode={conversionMode}
        onConversionModeChange={setConversionMode}
      />

      <Help />
    </ContentWrapper>
  );
}

export default Content;
