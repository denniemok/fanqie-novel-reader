import React, { useState } from 'react';
import styled from 'styled-components';
import AbstractModal from './AbstractModal';
import { cleanAbstract, truncateText, MAX_ABSTRACT_LENGTH, MOBILE_ABSTRACT_LENGTH } from '../utils/text';
import { useConvertedText } from '../hooks/useConvertedText';
import { useMediaQuery } from '../hooks/useMediaQuery';

const InfoWrapper = styled.div`
  display: flex;
  padding: 32px 24px;
  align-items: flex-start;
  gap: 24px;
  background-color: var(--background-color2);
  border-bottom: 1px solid var(--border-color);

  @media (max-width: 480px) {
    padding: 20px 16px;
    gap: 16px;
  }

  &.variant-card {
    border-bottom: none;
    border: 1px solid var(--border-color);
    border-radius: 12px;
    margin-bottom: 24px;
    padding: 24px;
    gap: 20px;

    @media (max-width: 480px) {
      padding: 16px;
      gap: 16px;
    }
  }
`;

const CoverWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  align-items: center;

  img {
    width: 120px;
    height: 160px;
    object-fit: cover;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 480px) {
    img {
      width: 80px;
      height: 107px;
    }
  }

  .variant-card & {
    img {
      width: 80px;
      height: 107px;
    }

    @media (max-width: 480px) {
      img {
        width: 60px;
        height: 80px;
      }
    }
  }
`;

const CoverMeta = styled.div`
  font-size: 11px;
  color: var(--text-color-secondary);
  text-align: center;
  width: 100%;
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
    margin: 6px 0 0 0;
  }
`;

const Abstract = styled.p`
  width: 100%;
  color: var(--text-color-secondary);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  word-break: break-word;
  white-space: normal;
  margin: 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const ShowMore = styled.button`
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--accent-color);
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--accent-hover);
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const Tags = styled.div`
  font-size: 12px;
  color: var(--text-color-secondary);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.75;
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
`;

const MetaTag = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;

  &.meta-score {
    background-color: rgba(129, 199, 132, 0.3);
    color: #81c784;
  }

  &.meta-category {
    background-color: rgba(100, 181, 246, 0.3);
    color: #64b5f6;
  }

  &.meta-subinfo {
    background-color: rgba(186, 104, 200, 0.3);
    color: #ba68c8;
  }
`;

const Footer = styled.div`
  margin-top: 12px;
  font-size: 14px;
  color: var(--text-color-secondary);
`;

function Info({ bookInfo, useTraditionalChinese = false, variant, footer }) {
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  const isMobile = useMediaQuery('(max-width: 480px)');
  
  const bookInfoData = bookInfo?.book_info || bookInfo || {};
  const { book_name, author, audio_thumb_uri, abstract, tags, score, category, sub_info, content_chapter_number } = bookInfoData;
  const chapterCount = bookInfo?.item_data_list?.length ?? content_chapter_number ?? null;

  const convertedAbstract = useConvertedText(abstract, useTraditionalChinese);
  const convertedBookName = useConvertedText(book_name, useTraditionalChinese);
  const convertedAuthor = useConvertedText(author, useTraditionalChinese);
  const convertedTags = useConvertedText(tags, useTraditionalChinese);
  const convertedCategory = useConvertedText(category, useTraditionalChinese);
  const convertedSubInfo = useConvertedText(sub_info, useTraditionalChinese);
  
  const fullAbstract = cleanAbstract(convertedAbstract);
  const maxLen = isMobile ? MOBILE_ABSTRACT_LENGTH : MAX_ABSTRACT_LENGTH;
  const truncated = truncateText(fullAbstract, maxLen);
  const isLong = fullAbstract.length > maxLen;

  if (!book_name && !author) return null;

  return (
    <InfoWrapper className={variant === 'card' ? 'variant-card' : ''}>
      {audio_thumb_uri && (
        <CoverWrapper>
          <img src={audio_thumb_uri} alt="書籍封面" width="128" height="128" />
          <CoverMeta>
            {chapterCount ? `共 ${chapterCount} 章節` : '暫無章節資訊'}
          </CoverMeta>
        </CoverWrapper>
      )}
      <TextBlock>
        <TitleBlock>
          <h1>{convertedBookName}</h1>
          <h3>{convertedAuthor}</h3>
        </TitleBlock>
        {tags && <Tags>{convertedTags}</Tags>}
        <Abstract>
          {isLong && (
            <ShowMore type="button" onClick={() => setShowFullAbstract(true)}>
              展開
            </ShowMore>
          )}
          {truncated}
        </Abstract>
        <MetaRow>
          {score && <MetaTag className="meta-score">評分: {score}</MetaTag>}
          {category && <MetaTag className="meta-category">{convertedCategory}</MetaTag>}
          {sub_info && <MetaTag className="meta-subinfo">{convertedSubInfo}</MetaTag>}
        </MetaRow>
        {footer && <Footer>{footer}</Footer>}
      </TextBlock>
      {showFullAbstract && (
        <AbstractModal text={fullAbstract} onClose={() => setShowFullAbstract(false)} />
      )}
    </InfoWrapper>
  );
}

export default Info;
