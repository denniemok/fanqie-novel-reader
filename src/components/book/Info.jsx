import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from '../common/Modal';
import { cleanAbstract, truncateText, MAX_ABSTRACT_LENGTH, MOBILE_ABSTRACT_LENGTH } from '../../utils/text';
import { useConvertedText } from '../../hooks/useConvertedText';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const InfoWrapper = styled.div`
  display: flex;
  padding: 32px 24px;
  align-items: flex-start;
  gap: 24px;
  background-color: var(--background-color2);
  border-bottom: var(--retro-border-width) solid var(--border-color);

  @media (max-width: 480px) {
    padding: 20px 16px;
    gap: 16px;
  }

  &.variant-card {
    border-bottom: none;
    border: var(--retro-border-width) solid var(--border-color);
    border-radius: 0;
    margin-bottom: 24px;
    padding: 24px;
    gap: 20px;
    box-shadow: var(--retro-shadow);

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
    border-radius: 0;
    border: 1px solid var(--border-color);
    box-shadow: 4px 4px 0px var(--background-color);
    opacity: 0.65;
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
      box-shadow: 3px 3px 0px var(--background-color);
    }
  }
`;

const CoverMeta = styled.div`
  font-size: 11px;
  color: var(--text-color-secondary);
  text-align: center;
  width: 100%;
  font-family: inherit;

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
    font-weight: 900;
    line-height: 1.3;
    margin: 0;
    text-transform: uppercase;
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
    font-weight: 700;
    line-height: 1;
    margin: 6px 0 0 0;
    font-family: inherit;
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
  font-family: inherit;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const ShowMore = styled.button`
  background: var(--background-color2);
  border: 1px solid var(--border-color);
  padding: 2px 6px;
  font-size: 12px;
  font-weight: 900;
  color: var(--accent-color);
  cursor: pointer;
  transition: all 0.1s steps(2);
  margin-right: 8px;
  text-transform: uppercase;

  &:hover {
    background: var(--accent-color);
    color: var(--background-color);
  }

  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const Tags = styled.div`
  font-size: 12px;
  color: var(--text-color-secondary);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.8;
  font-family: inherit;
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
  padding: 4px 6px;
  border-radius: 0;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  border: 1px solid var(--border-color);
  background: var(--background-color2);
  font-family: inherit;

  &.meta-score {
    color: #a7b8a7;
  }

  &.meta-category {
    color: #8fa3a3;
  }

  &.meta-subinfo {
    color: #a38fa3;
  }

  &.meta-word-number {
    color: #a3a38f;
  }

  &.meta-creation-status {
    color: #8fa38f;
  }

  &.meta-publish-time {
    color: #888880;
  }

  &.meta-chapters {
    color: var(--text-color);
  }
`;

const Footer = styled.div`
  margin-top: 12px;
  font-size: 14px;
  color: var(--text-color-secondary);
  font-family: inherit;
  border-top: 1px dashed var(--border-color);
  padding-top: 8px;
  width: 100%;
`;

function Info({ bookInfo, conversionMode = 'tw', variant, footer }) {
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  const isMobile = useMediaQuery('(max-width: 480px)');
  
  const bookInfoData = bookInfo?.book_info || bookInfo || {};
  const { original_book_name, author, audio_thumb_uri, abstract, tags, score, category, sub_info, word_number, creation_status, last_publish_time } = bookInfoData;
  const chapter_count = bookInfo?.chapter_count ?? null;

  const convertedAbstract = useConvertedText(abstract, conversionMode);
  const convertedBookName = useConvertedText(original_book_name, conversionMode);
  const convertedAuthor = useConvertedText(author, conversionMode);
  const convertedTags = useConvertedText(tags, conversionMode);
  const convertedCategory = useConvertedText(category, conversionMode);
  const convertedSubInfo = useConvertedText(sub_info, conversionMode);
  const convertedWordNumber = useConvertedText(word_number, conversionMode);
  const convertedCreationStatus = useConvertedText(creation_status, conversionMode);
  
  const fullAbstract = cleanAbstract(convertedAbstract);
  const maxLen = isMobile ? MOBILE_ABSTRACT_LENGTH : MAX_ABSTRACT_LENGTH;
  const truncated = truncateText(fullAbstract, maxLen);
  const isLong = fullAbstract.length > maxLen;
  const isCompact = variant === 'compact';

  if (!original_book_name && !author) return null;

  const wrapperClass = variant === 'card' ? 'variant-card' : variant === 'compact' ? 'variant-compact' : '';

  return (
    <InfoWrapper className={wrapperClass}>
{audio_thumb_uri && (
          <CoverWrapper>
          <img src={audio_thumb_uri} alt="書籍封面" width="128" height="128" />
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
          {!audio_thumb_uri && (
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
        <Modal text={fullAbstract} onClose={() => setShowFullAbstract(false)} />
      )}
    </InfoWrapper>
  );
}

export default Info;
