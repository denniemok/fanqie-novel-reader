import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Modal from '../ui/Modal';
import { formatExpandedAbstract } from '../../utils/text/text';
import { useConvertedText } from '../../hooks/useConvertedText';
import { resolveBookDisplay } from '../../utils/book/bookInfo';
import { useBookDisplayVariant } from '../../contexts/BookDisplayVariantContext';

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
    width: 116px;
    height: 155px;
    object-fit: cover;
    border-radius: 0;
    border: 1px solid var(--border-color);
    box-shadow: var(--retro-shadow);
    background-color: var(--cover-bg);
    opacity: 0.9;
    display: block;
    transition: transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1), box-shadow 0.25s ease;
  }

  &:hover img {
    transform: scale(1.02) rotate(-0.5deg);
    box-shadow: var(--retro-shadow-hover);
  }

  @media (max-width: 480px) {
    img {
      width: 110px;
      height: 147px;
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
      box-shadow: var(--retro-shadow);
    }

    @media (max-width: 480px) {
      img {
        width: 96px;
        height: 128px;
      }
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

    @media (max-width: 480px) {
      width: 96px;
    }
  }
`;

const CoverPlaceholder = styled.div`
  width: 116px;
  height: 155px;
  background-color: var(--cover-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--retro-shadow);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--text-color-secondary);

  @media (max-width: 480px) {
    width: 110px;
    height: 147px;
  }

  .variant-card & {
    width: 80px;
    height: 107px;

    @media (max-width: 480px) {
      width: 60px;
      height: 80px;
    }
  }

  .variant-compact & {
    width: 100px;
    height: 134px;

    @media (max-width: 480px) {
      width: 96px;
      height: 128px;
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

  .variant-compact & {
    gap: 8px;
    justify-content: center;
  }
`;

const HorizontalScroll = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  max-width: 100%;
  min-width: 0;
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  width: 100%;

  .variant-compact & h1 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    align-self: stretch;
    overflow: hidden;
    color: var(--text-color);
    font-size: 20px;
    font-weight: 900;
    line-height: 1.3;
    margin: 0;
    text-transform: uppercase;
    white-space: nowrap;

    @media (max-width: 480px) {
      font-size: 18px;
    }
  }

  .variant-compact & h3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    align-self: stretch;
    overflow: hidden;
    color: var(--accent-color);
    font-size: 14px;
    font-weight: 700;
    line-height: 1;
    margin: 0;
    font-family: inherit;

    @media (max-width: 480px) {
      font-size: 13px;
    }
  }
`;

const TitleText = styled.span`
  white-space: nowrap;
  flex-shrink: 0;
  color: var(--text-color);
  font-size: 22px;
  font-weight: 900;
  line-height: 1.3;
  text-transform: uppercase;

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const AuthorText = styled.span`
  white-space: nowrap;
  flex-shrink: 0;
  color: var(--accent-color);
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
  font-family: inherit;

  @media (max-width: 480px) {
    font-size: 13px;
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
  background: none;
  border: none;
  padding: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.6;
  color: var(--accent-color);
  cursor: pointer;
  margin-right: 6px;
  font-family: inherit;

  &:hover {
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const Tags = styled.div`
  width: 100%;
  font-size: 12px;
  color: var(--text-color-secondary);
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.8;
  font-family: inherit;
`;

const ScrollableTagText = styled.span`
  white-space: nowrap;
  flex-shrink: 0;
  font-size: 12px;
  color: var(--text-color-secondary);
  line-height: 1.3;
  opacity: 0.8;
  font-family: inherit;
`;

const MetaRow = styled(HorizontalScroll)`
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
  flex-shrink: 0;
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

function BookInfo({ bookInfo, conversionMode = 'tw', variant, footer, showChapterCount = true }) {
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { variant: displayVariant } = useBookDisplayVariant();
  
  const bookInfoData = bookInfo?.book_info || bookInfo || {};
  const { book_name, thumb_url } = resolveBookDisplay(bookInfoData, displayVariant);
  const { author, abstract, tags, score, category, sub_info, word_number, creation_status, last_publish_time } = bookInfoData;
  const chapter_count = bookInfo?.chapter_count ?? null;

  useEffect(() => {
    setImgError(false);
  }, [thumb_url, displayVariant]);

  const convertedAbstract = useConvertedText(abstract, conversionMode);
  const convertedBookName = useConvertedText(book_name, conversionMode);
  const convertedAuthor = useConvertedText(author, conversionMode);
  const convertedTags = useConvertedText(tags, conversionMode);
  const convertedCategory = useConvertedText(category, conversionMode);
  const convertedSubInfo = useConvertedText(sub_info, conversionMode);
  const convertedWordNumber = useConvertedText(word_number, conversionMode);
  const convertedCreationStatus = useConvertedText(creation_status, conversionMode);
  
  const isCompact = variant === 'compact';

  if (!book_name && !author) return null;

  const wrapperClass = variant === 'card' ? 'variant-card' : variant === 'compact' ? 'variant-compact' : '';
  const scrollCaptureProps = isCompact
    ? { onClick: (e) => e.stopPropagation(), onTouchStart: (e) => e.stopPropagation() }
    : {};

  return (
    <InfoWrapper className={wrapperClass}>
      {thumb_url && (
          <CoverWrapper>
          {imgError ? (
            <CoverPlaceholder>無封面</CoverPlaceholder>
          ) : (
            <img src={thumb_url} alt="書籍封面" width="128" height="128" onError={() => setImgError(true)} />
          )}
          {showChapterCount && (
            <CoverMeta>
              {chapter_count ? `共 ${chapter_count} 章節` : '暫無章節資訊'}
            </CoverMeta>
          )}
        </CoverWrapper>
      )}
      <TextBlock>
        <TitleBlock>
          {isCompact ? (
            <>
              <h1>{convertedBookName}</h1>
              {convertedAuthor && <h3>{convertedAuthor}</h3>}
            </>
          ) : (
            <>
              <HorizontalScroll role="group" aria-label="書名">
                <TitleText>{convertedBookName}</TitleText>
              </HorizontalScroll>
              {convertedAuthor && (
                <HorizontalScroll role="group" aria-label="作者">
                  <AuthorText>{convertedAuthor}</AuthorText>
                </HorizontalScroll>
              )}
            </>
          )}
        </TitleBlock>
        {tags && (
          isCompact ? (
            <Tags>{convertedTags}</Tags>
          ) : (
            <HorizontalScroll role="group" aria-label="標籤">
              <ScrollableTagText>{convertedTags}</ScrollableTagText>
            </HorizontalScroll>
          )
        )}
        <Abstract>
          {!isCompact && (
            <ShowMore type="button" onClick={() => setShowFullAbstract(true)}>
              展開
            </ShowMore>
          )}
          {convertedAbstract}
        </Abstract>
        <MetaRow {...scrollCaptureProps}>
          {showChapterCount && !thumb_url && (
            <MetaTag className="meta-chapters">{chapter_count ? `共 ${chapter_count} 章節` : '暫無章節資訊'}</MetaTag>
          )}
          {score && (
            <MetaTag className="meta-score">評分 {score}</MetaTag>
          )}
          {category && <MetaTag className="meta-category">{convertedCategory}</MetaTag>}
          {sub_info && <MetaTag className="meta-subinfo">{convertedSubInfo}</MetaTag>}
          {word_number && <MetaTag className="meta-word-number">{convertedWordNumber}字</MetaTag>}
          {creation_status && <MetaTag className="meta-creation-status">{convertedCreationStatus}</MetaTag>}
          {last_publish_time && <MetaTag className="meta-publish-time">更新 {last_publish_time}</MetaTag>}
        </MetaRow>
        {!isCompact && footer && <Footer>{footer}</Footer>}
      </TextBlock>
      {!isCompact && showFullAbstract && (
        <Modal text={formatExpandedAbstract(convertedAbstract)} onClose={() => setShowFullAbstract(false)} />
      )}
    </InfoWrapper>
  );
}

export default BookInfo;
