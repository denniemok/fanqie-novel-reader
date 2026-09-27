import React, { useEffect } from 'react';
import styled from 'styled-components';
import { maybeConvert } from '../../utils/text/zh-convert';
import { FONT_SIZE_DEFAULT, TEXT_BRIGHTNESS_DEFAULT } from '../../utils/constants';
import { loadWebFont } from '../../utils/fontLoader';

const DEFAULT_READER_FONT = "'Noto Serif TC', 'Noto Serif SC', sans-serif";

const ReaderWrapper = styled.article`
  --reader-ink: color-mix(in srgb, ${(p) => p.$textColor ?? 'var(--text-color)'} ${(p) => p.$textBrightness ?? TEXT_BRIGHTNESS_DEFAULT}%, transparent);
  margin: 0 auto;
  padding: 56px 28px 64px;
  max-width: 780px;
  background: transparent;
  font-family: ${(p) => p.$fontFamily ?? DEFAULT_READER_FONT};
  overflow-wrap: anywhere;

  @media (max-width: 480px) {
    padding: 36px 20px 48px;
  }

  p {
    margin: 0 0 1em;
    font-weight: 400;
    line-height: 2;
    font-size: ${(p) => p.$fontSize ?? FONT_SIZE_DEFAULT}px;
    color: var(--reader-ink);
    text-align: justify;
    text-indent: ${(p) => (p.$indent ? '2em' : '0')};
    letter-spacing: 0.05em;
    hanging-punctuation: allow-end;
  }

  br {
    display: none;
  }
`;

const ChapterHeading = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3em;
  font-size: ${(p) => p.$fontSize ?? FONT_SIZE_DEFAULT}px;

  h2 {
    margin: 0;
    font-size: 0.8em;
    font-weight: 600;
    line-height: 1.6;
    letter-spacing: 0.12em;
    text-align: center;
    color: var(--reader-ink);
  }

  &::after {
    content: '';
    width: 1.2em;
    height: 1px;
    margin-top: 1em;
    background: var(--reader-ink);
    opacity: 0.35;
  }
`;

function Reader({
  chapterData,
  fontSize = FONT_SIZE_DEFAULT,
  fontFamily = DEFAULT_READER_FONT,
  textBrightness = TEXT_BRIGHTNESS_DEFAULT,
  indent = false,
  readerTextColor,
  conversionMode = 'tw',
  headingRef,
}) {
  useEffect(() => {
    loadWebFont(fontFamily);
  }, [fontFamily]);

  if (!chapterData || !chapterData.content) return null;

  const convertedContent = maybeConvert(chapterData.content, conversionMode);
  const rawTitle = chapterData.novel_data?.title;
  const title = rawTitle ? maybeConvert(rawTitle, conversionMode).trim() : '';

  const paragraphs = convertedContent
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Some sources repeat the chapter title as the first line; the heading already shows it.
  if (title && paragraphs[0] === title) paragraphs.shift();

  return (
    <ReaderWrapper
      $fontSize={fontSize}
      $fontFamily={fontFamily}
      $textBrightness={textBrightness}
      $indent={indent}
      $textColor={readerTextColor}
    >
      {title && (
        <ChapterHeading ref={headingRef} $fontSize={fontSize}>
          <h2>{title}</h2>
        </ChapterHeading>
      )}
      {paragraphs.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </ReaderWrapper>
  );
}

export default Reader;
