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

  &.variant-compact {
    padding: 0;
    gap: 20px;
    background: none;
    border: none;
    border-bottom: none;
    flex: 1;
    min-width: 0;

    @media (max-width: 480px) {
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

  .variant-compact & {
    img {
      width: 100px;
      height: 134px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    }
  }
`;

const CoverMeta = styled.div`
  font-size: 11px;
  color: var(--text-color-secondary);
  text-align: center;
  width: 100%;

  .variant-compact & {
    width: 100px;
  }
`;

const TextBlock = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;

  .variant-compact & {
    gap: 8px;
    justify-content: center;
  }
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

  .variant-compact & h1 {
    font-size: 20px;
    white-space: nowrap;
    -webkit-line-clamp: 1;
  }

  .variant-compact & h3 {
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

  .variant-compact & {
    margin-top: 4px;
  }
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

  &.meta-word-number {
    background-color: rgba(255, 167, 38, 0.3);
    color: #ffa726;
  }

  &.meta-creation-status {
    background-color: rgba(77, 208, 225, 0.3);
    color: #4dd0e1;
  }

  &.meta-publish-time {
    background-color: rgba(161, 136, 127, 0.3);
    color: #a1887f;
  }

  &.meta-chapters {
    background-color: rgba(var(--accent-color-rgb, 255, 193, 7), 0.15);
    color: var(--text-color);
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
  const { original_book_name, author, thumb_url, abstract, tags, score, category, sub_info, word_number, creation_status, last_publish_time } = bookInfoData;
  const chapter_count = bookInfo?.chapter_count ?? null;

  const convertedAbstract = useConvertedText(abstract, useTraditionalChinese);
  const convertedBookName = useConvertedText(original_book_name, useTraditionalChinese);
  const convertedAuthor = useConvertedText(author, useTraditionalChinese);
  const convertedTags = useConvertedText(tags, useTraditionalChinese);
  const convertedCategory = useConvertedText(category, useTraditionalChinese);
  const convertedSubInfo = useConvertedText(sub_info, useTraditionalChinese);
  const convertedWordNumber = useConvertedText(word_number, useTraditionalChinese);
  const convertedCreationStatus = useConvertedText(creation_status, useTraditionalChinese);
  
  const fullAbstract = cleanAbstract(convertedAbstract);
  const maxLen = isMobile ? MOBILE_ABSTRACT_LENGTH : MAX_ABSTRACT_LENGTH;
  const truncated = truncateText(fullAbstract, maxLen);
  const isLong = fullAbstract.length > maxLen;
  const isCompact = variant === 'compact';

  if (!original_book_name && !author) return null;

  const wrapperClass = variant === 'card' ? 'variant-card' : variant === 'compact' ? 'variant-compact' : '';

  return (
    <InfoWrapper className={wrapperClass}>
{thumb_url && (
          <CoverWrapper>
          <img src={thumb_url} alt="書籍封面" width="128" height="128" />
          <CoverMeta>
            {chapter_count ? `共 ${chapter_count} 章節` : '暫無章節資訊'}
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
          {!isCompact && isLong && (
            <ShowMore type="button" onClick={() => setShowFullAbstract(true)}>
              展開
            </ShowMore>
          )}
          {truncated}
        </Abstract>
        <MetaRow>
          {!thumb_url && (
            <MetaTag className="meta-chapters">{chapter_count ? `共 ${chapter_count} 章節` : '暫無章節資訊'}</MetaTag>
          )}
          {score && (
            <MetaTag className="meta-score">評分: {score}</MetaTag>
          )}
          {category && <MetaTag className="meta-category">{convertedCategory}</MetaTag>}
          {sub_info && <MetaTag className="meta-subinfo">{convertedSubInfo}</MetaTag>}
          {word_number && <MetaTag className="meta-word-number">{convertedWordNumber}字</MetaTag>}
          {creation_status && <MetaTag className="meta-creation-status">{convertedCreationStatus}</MetaTag>}
          {last_publish_time && <MetaTag className="meta-publish-time">更新: {last_publish_time}</MetaTag>}
        </MetaRow>
        {!isCompact && footer && <Footer>{footer}</Footer>}
      </TextBlock>
      {!isCompact && showFullAbstract && (
        <AbstractModal text={fullAbstract} onClose={() => setShowFullAbstract(false)} />
      )}
    </InfoWrapper>
  );
}

export default Info;
