import React, { useState } from 'react';
import styled from 'styled-components';
import AbstractModal from './AbstractModal';
import { cleanAbstract, truncateText, MAX_ABSTRACT_LENGTH, MOBILE_ABSTRACT_LENGTH } from '../utils/text';
import { maybeConvert } from '../utils/zh-convert';
import { useMediaQuery } from '../hooks/useMediaQuery';

const InfoWrapper = styled.div`
  display: flex;
  padding: 32px 24px;
  align-items: flex-start;
  gap: 24px;
  background-color: var(--background-color2);
  border-bottom: 1px solid var(--border-color);

  img {
    width: 120px;
    height: 160px;
    object-fit: cover;
    border-radius: 12px;
    flex-shrink: 0;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 480px) {
    padding: 20px 16px;
    gap: 16px;

    img {
      width: 80px;
      height: 107px;
    }
  }
`;

const TextBlock = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  width: 100%;

  h1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    align-self: stretch;
    overflow: hidden;
    color: var(--text-color);
    font-size: 22px;
    font-weight: 700;
    line-height: 1.3;
    margin: 0;
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 18px;
    }
    h3 {
      font-size: 13px;
    }
  }

  h3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    align-self: stretch;
    overflow: hidden;
    color: var(--accent-color);
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    margin: 0;
  }
`;

const Abstract = styled.p`
  width: 100%;
  color: var(--text-color-secondary);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-line;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 13px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    white-space: normal;
  }
`;

const ShowMore = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin-top: 4px;
  font-size: 14px;
  font-weight: 500;
  color: var(--accent-color);
  cursor: pointer;
  text-align: left;
  transition: color 0.2s ease;

  &:hover {
    color: var(--accent-hover);
  }
`;

function Info({ bookInfo, useTraditionalChinese = false }) {
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  const isMobile = useMediaQuery('(max-width: 480px)');
  const bookData = bookInfo ? bookInfo : { book_info: {} };
  const bookInfoData = bookData.book_info || {};
  const fullAbstract = cleanAbstract(maybeConvert(bookInfoData.abstract, useTraditionalChinese));
  const maxLen = isMobile ? MOBILE_ABSTRACT_LENGTH : MAX_ABSTRACT_LENGTH;
  const truncated = truncateText(fullAbstract, maxLen);
  const isLong = fullAbstract.length > maxLen;

  if (!bookInfoData.book_name && !bookInfoData.author) return null;

  return (
    <InfoWrapper>
      <img
        src={bookInfoData.audio_thumb_uri}
        alt="書籍封面"
        width="128"
        height="128"
      />
      <TextBlock>
        <TitleBlock>
          <h1>{maybeConvert(bookInfoData.book_name, useTraditionalChinese)}</h1>
          <h3>作者: {maybeConvert(bookInfoData.author, useTraditionalChinese)}</h3>
        </TitleBlock>
        <Abstract>{truncated}</Abstract>
        {isLong && (
          <ShowMore type="button" onClick={() => setShowFullAbstract(true)}>
            展開
          </ShowMore>
        )}
      </TextBlock>
      {showFullAbstract && (
        <AbstractModal text={fullAbstract} onClose={() => setShowFullAbstract(false)} />
      )}
    </InfoWrapper>
  );
}

export default Info;
