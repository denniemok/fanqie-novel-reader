import React from 'react';
import styled from 'styled-components';
import { maybeConvert } from '../../utils/text/zh-convert';
import { FONT_SIZE_DEFAULT, TEXT_BRIGHTNESS_DEFAULT } from '../../utils/constants';
import { minViewportHeight } from '../../utils/styled/viewport';

const ReaderWrapper = styled.div`
  margin: 0 auto;
  padding: 40px 24px 100px 24px;
  padding-top: calc(140px + env(safe-area-inset-top));
  padding-bottom: calc(100px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)));
  max-width: 800px;
  background-color: ${(p) => p.$readerBackground ?? 'var(--background-color)'};
  ${minViewportHeight}

  @media (max-width: 480px) {
    padding: 24px 16px 100px 16px;
    padding-top: calc(130px + env(safe-area-inset-top));
    padding-bottom: calc(100px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)));
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
  readerBackground,
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
      $readerBackground={readerBackground}
    >
      {paragraphs.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </ReaderWrapper>
  );
}

export default Reader;
