import React from 'react';
import styled from 'styled-components';
import { maybeConvert } from '../../utils/text/zh-convert';
import { FONT_SIZE_DEFAULT, TEXT_BRIGHTNESS_DEFAULT } from '../../utils/constants';
const ReaderWrapper = styled.div`
  margin: 0 auto;
  padding: 32px 24px 40px;
  max-width: 800px;
  background: transparent;

  @media (max-width: 480px) {
    padding: 24px 16px 32px;
  }

  p {
    line-height: 2;
    font-size: ${(p) => p.$fontSize ?? FONT_SIZE_DEFAULT}px;
    color: color-mix(in srgb, ${(p) => p.$textColor ?? 'var(--text-color)'} ${(p) => p.$textBrightness ?? TEXT_BRIGHTNESS_DEFAULT}%, transparent);
    margin-bottom: 1.8em;
    text-align: justify;
    letter-spacing: 0.05em;
    font-family: ${(p) => p.$fontFamily ?? "'Noto Serif TC', 'Noto Serif SC', sans-serif"};
  }

  br {
    display: none;
  }
`;

function Reader({
  chapterData,
  fontSize = FONT_SIZE_DEFAULT,
  fontFamily = "'Noto Serif TC', 'Noto Serif SC', sans-serif",
  textBrightness = TEXT_BRIGHTNESS_DEFAULT,
  readerTextColor,
  conversionMode = 'tw',
}) {
  if (!chapterData || !chapterData.content) return null;

  const convertedContent = maybeConvert(chapterData.content, conversionMode);

  const paragraphs = convertedContent
    .split('\n')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <ReaderWrapper
      $fontSize={fontSize}
      $fontFamily={fontFamily}
      $textBrightness={textBrightness}
      $textColor={readerTextColor}
    >
      {paragraphs.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </ReaderWrapper>
  );
}

export default Reader;
