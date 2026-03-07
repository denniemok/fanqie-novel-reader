import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { deleteBookData, getLastReadChapter } from '../../utils/storage';
import { useTraditionalChineseToggle } from '../../hooks/useTraditionalChineseToggle';
import { maybeConvert } from '../../utils/zh-convert';
import { buildChapterOrCatalogUrl, buildCatalogUrl, buildCommentsUrl } from '../../utils/navigation';
import Bookshelf from './Bookshelf';
import AddBook from './AddBook';
import Help from './Help';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--background-color);
  color: var(--text-color);
  padding: 40px 24px;
  padding-top: calc(40px + env(safe-area-inset-top));
  padding-bottom: calc(40px + env(safe-area-inset-bottom));
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 480px) {
    padding: 24px 16px;
    padding-top: calc(24px + env(safe-area-inset-top));
    padding-bottom: calc(24px + env(safe-area-inset-bottom));
  }
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 48px;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, var(--accent-color), #ffcc80);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.02em;

  @media (max-width: 480px) {
    font-size: 26px;
  }
`;

const Subtitle = styled.p`
  font-size: 16px;
  color: var(--text-color-secondary);
  max-width: 400px;
  line-height: 0.8;
  margin: 0;
`;

function Content() {
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [useTraditionalChinese, toggleTraditionalChinese] = useTraditionalChineseToggle();

  const handleBookInputSubmit = (bookId) => {
    const lastReadItemId = getLastReadChapter(bookId);
    navigate(buildChapterOrCatalogUrl(bookId, lastReadItemId));
  };

  const handleBookClick = (bookId) => {
    const lastReadItemId = getLastReadChapter(bookId);
    navigate(buildChapterOrCatalogUrl(bookId, lastReadItemId));
  };

  const handleCatalogClick = (e, bookId) => {
    e.stopPropagation();
    navigate(buildCatalogUrl(bookId));
  };

  const handleCommentClick = (e, bookId) => {
    e.stopPropagation();
    navigate(buildCommentsUrl(bookId));
  };

  const handleDeleteBook = (e, bookId, bookInfo) => {
    e.stopPropagation();
    const bookName = bookInfo?.book_info?.original_book_name;
    const convertedName = maybeConvert(bookName, useTraditionalChinese) || bookId;
    if (window.confirm(`確定要刪除「${convertedName}」的所有本地資料嗎？`)) {
      deleteBookData(bookId);
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <ContentWrapper>
      <Header>
        <Title>番茄小說閱讀器</Title>
        <Subtitle>本地儲存、免安裝、免註冊、無廣告</Subtitle>
        <Subtitle>無需中國大陸手機號即可在線存取番茄小說</Subtitle>
        <Subtitle>支援多章節下載與 TXT 匯出</Subtitle>
      </Header>

      <Bookshelf
        refreshKey={refreshKey}
        onBookClick={handleBookClick}
        onCatalogClick={handleCatalogClick}
        onCommentClick={handleCommentClick}
        onDeleteClick={handleDeleteBook}
        useTraditionalChinese={useTraditionalChinese}
      />

      <AddBook
        onSubmit={handleBookInputSubmit}
        refreshKey={refreshKey}
        useTraditionalChinese={useTraditionalChinese}
        onTraditionalChineseToggle={toggleTraditionalChinese}
      />

      <Help />
    </ContentWrapper>
  );
}

export default Content;
