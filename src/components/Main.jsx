import React from 'react';
import styled from 'styled-components';

const MainWrapper = styled.div`
  margin: 0 auto;
  padding: 40px 24px 100px 24px;
  padding-bottom: calc(100px + env(safe-area-inset-bottom));
  max-width: 800px;
  background-color: var(--background-color);
  min-height: 100vh;

  @media (max-width: 480px) {
    padding: 24px 16px 100px 16px;
    padding-bottom: calc(100px + env(safe-area-inset-bottom));
  }

  p {
    line-height: 1.8;
    font-size: ${(p) => p.$fontSize ?? 18}px;
    color: color-mix(in srgb, var(--text-color) ${(p) => p.$textBrightness ?? 90}%, transparent);
    margin-bottom: 1.5em;
    text-align: justify;
    letter-spacing: 0.02em;
    font-family: 'Georgia', serif; /* Classic serif for reading comfort */
  }

  /* Fallback to sans-serif if Georgia not available */
  @supports not (font-family: 'Georgia') {
    p {
      font-family: 'Inter', -apple-system, sans-serif;
    }
  }

  br {
    display: none; /* We use margin on p instead */
  }
`;

function Main({ chapterData, fontSize = 18, textBrightness = 90 }) {
  if (!chapterData || !chapterData.content) return null;

  // Split content by newlines and wrap in <p> tags for better semantics and styling
  const paragraphs = chapterData.content
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 0);

  return (
    <MainWrapper $fontSize={fontSize} $textBrightness={textBrightness}>
      {paragraphs.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
    </MainWrapper>
  );
}

export default Main;
