import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API_OPTIONS, getApiBase, setApiBase } from '../api';
import { BOOK_ID_KEY, DIRECTORY_CACHE_KEY, DETAIL_CACHE_KEY } from '../utils/constants';
import { safeGetItem, safeSetItem, safeGetJSON, getLastReadChapter, deleteBookData } from '../utils/storage';
import AbstractModal from './AbstractModal';
import { cleanAbstract, truncateText, MAX_ABSTRACT_LENGTH } from '../utils/text';

import { BookOpen, Search, Info as InfoIcon, Globe, Trash2 } from 'lucide-react';

const NullPageWrapper = styled.div`
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
  line-height: 1.5;
  margin: 0;
`;

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

const SavedBookCard = styled.div`
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

  .meta {
    font-size: 12px;
    color: var(--text-color-secondary);
    margin-top: 4px;
  }

  .abstract {
    font-size: 13px;
    color: var(--text-color-secondary);
    line-height: 1.5;
    margin-top: 8px;
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

const DeleteButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px;
  border-radius: 10px;
  background-color: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
    background-color: #dc2626;
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

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  box-sizing: border-box; /* Ensure padding doesn't affect width */
  background-color: var(--background-color2);
  border-radius: 20px;
  border: 1px solid var(--border-color);
  width: 100%;
`;

const Form = styled.form`
  display: flex;
  gap: 12px;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
  }

  input {
    flex: 1;
    padding: 14px 20px;
    border-radius: 14px;
    background-color: var(--background-color);
    border: 1px solid var(--border-color);
    color: var(--text-color);
    font-size: 16px;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--accent-color);
      box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.2);
    }

    &::placeholder {
      color: var(--text-color-secondary);
      opacity: 0.5;
    }
  }

  button {
    padding: 14px 28px;
    border-radius: 14px;
    background-color: var(--accent-color);
    color: #000;
    border: none;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
      background-color: var(--accent-hover);
      transform: scale(1.02);
    }

    &:active {
      transform: scale(0.98);
    }
  }
`;

const ApiSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: var(--text-color-secondary);

  select {
    background: none;
    border: none;
    color: var(--accent-color);
    font-weight: 600;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: background 0.2s;

    &:hover {
      background: var(--hover-background-color);
    }

    &:focus {
      outline: none;
    }
  }
`;

const HelpGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const HelpCard = styled.div`
  padding: 20px;
  background-color: var(--background-color2);
  border-radius: 20px;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 12px;

  h3 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: var(--text-color);
  }

  p {
    font-size: 13px;
    color: var(--text-color-secondary);
    line-height: 1.6;
    margin: 0;

    span {
      color: var(--accent-color);
      font-weight: 500;
    }
  }

  .code-box {
    padding: 10px 14px;
    background-color: var(--background-color);
    border-radius: 10px;
    font-family: monospace;
    font-size: 12px;
    color: var(--text-color-secondary);
    overflow-x: auto;
    border: 1px solid var(--border-color);

    span {
      color: var(--accent-color);
      font-weight: bold;
    }
  }
`;

function NullPage() {
  const navigate = useNavigate();
  const [apiBase, setApiBaseState] = useState(() => getApiBase());
  const [refreshKey, setRefreshKey] = useState(0);
  const savedBookId = safeGetItem(BOOK_ID_KEY) ?? '';

  const handleApiChange = (e) => {
    const url = e.target.value;
    setApiBase(url);
    setApiBaseState(url);
  };

  let savedBookInfo = null;
  if (savedBookId) {
    try {
      const directory = safeGetJSON(`${DIRECTORY_CACHE_KEY}-${savedBookId}`);
      const detail = safeGetJSON(`${DETAIL_CACHE_KEY}-${savedBookId}`);
      const list = directory?.data?.data?.data?.item_data_list ?? [];
      savedBookInfo = {
        chapterCount: list.length,
        book_name: detail?.book_name || list[0]?.title || `書籍 ${savedBookId.slice(0, 8)}`,
        author: detail?.author || '未知作者',
        abstract: cleanAbstract(detail?.abstract) || null,
        audio_thumb_uri: detail?.audio_thumb_uri || null,
      };
    } catch {}
  }

  const handleButtonClick = () => {
    const inputElement = document.getElementById('bookIdInput');
    const bookId = inputElement.value?.trim();
    if (bookId) {
      safeSetItem(BOOK_ID_KEY, bookId);
      const lastReadItemId = getLastReadChapter(bookId);
      navigate(lastReadItemId ? `/chapter?bookId=${bookId}&itemId=${lastReadItemId}` : `/catalog?bookId=${bookId}`);
    }
  };

  const handleSavedBookClick = () => {
    const lastReadItemId = getLastReadChapter(savedBookId);
    navigate(lastReadItemId ? `/chapter?bookId=${savedBookId}&itemId=${lastReadItemId}` : `/catalog?bookId=${savedBookId}`);
  };

  const handleDeleteBook = (e) => {
    e.stopPropagation();
    if (window.confirm(`確定要刪除「${savedBookInfo?.book_name || savedBookId}」的所有本地資料嗎？`)) {
      deleteBookData(savedBookId);
      setRefreshKey((k) => k + 1);
    }
  };

  return (
    <NullPageWrapper>
      <Header>
        <Title>番茄閱讀器</Title>
        <Subtitle>簡單、乾淨、無廣告的沉浸式小說閱讀體驗</Subtitle>
      </Header>

      {savedBookId && savedBookInfo && (
        <Section key={refreshKey}>
          <SectionTitle><BookOpen /> 最近閱讀</SectionTitle>
          <SavedBookCard onClick={handleSavedBookClick}>
            <DeleteButton
              type="button"
              onClick={handleDeleteBook}
              title="刪除此書的本地資料"
              aria-label="刪除此書的本地資料"
            >
              <Trash2 />
            </DeleteButton>
            {savedBookInfo.audio_thumb_uri && (
              <img src={savedBookInfo.audio_thumb_uri} alt="封面" />
            )}
            <div className="content">
              <h3 className="title">{savedBookInfo.book_name}</h3>
              <div className="author">{savedBookInfo.author}</div>
              {savedBookInfo.abstract && (
                <div className="abstract">{savedBookInfo.abstract}</div>
              )}
              <div className="meta">
                {savedBookInfo.chapterCount > 0 ? `共 ${savedBookInfo.chapterCount} 章節` : '暫無章節資訊'}
              </div>
            </div>
            <div className="action-hint">繼續閱讀 →</div>
          </SavedBookCard>
        </Section>
      )}

      <Section>
        <SectionTitle><Search /> 開始新閱讀</SectionTitle>
        <InputGroup>
          <Form onSubmit={(e) => { e.preventDefault(); handleButtonClick(); }}>
            <input 
              key={savedBookId || 'empty'}
              id="bookIdInput" 
              type="text" 
              placeholder="貼上書籍 bookId 或 URL" 
              defaultValue={savedBookId} 
            />
            <button type="submit">開始閱讀</button>
          </Form>
          <ApiSelectWrapper>
            <Globe size={14} />
            <span>API 服務:</span>
            <select id="apiSelect" value={apiBase} onChange={handleApiChange}>
              {API_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.url}>
                  {opt.label}
                </option>
              ))}
            </select>
          </ApiSelectWrapper>
        </InputGroup>
      </Section>

      <Section>
        <SectionTitle><InfoIcon /> 幫助指南</SectionTitle>
        <HelpGrid>
          <HelpCard>
            <h3>找到書籍</h3>
            <p>造訪 <span>番茄小說網</span> (fanqienovel.com) 找到您想閱讀的小說。</p>
          </HelpCard>
          <HelpCard>
            <h3>獲取 bookId</h3>
            <p>在小說詳情頁的 URL 中找到那一串數字：</p>
            <div className="code-box">
              .../page/<span>123456789</span>?...
            </div>
          </HelpCard>
        </HelpGrid>
      </Section>
    </NullPageWrapper>
  );
}

export default NullPage;
