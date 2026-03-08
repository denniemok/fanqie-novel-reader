import React from 'react';
import styled from 'styled-components';
import { Info as InfoIcon } from 'lucide-react';

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

  a.link-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    border-radius: 12px;
    background-color: var(--accent-color);
    color: #000;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
    align-self: flex-start;

    &:hover {
      background-color: var(--accent-hover);
      transform: scale(1.02);
    }

    &:active {
      transform: scale(0.98);
    }
  }
`;

function Help() {
  return (
    <Section>
      <SectionTitle><InfoIcon /> 幫助指南</SectionTitle>
      <HelpGrid>
        <HelpCard>
          <h3>找到書籍</h3>
          <p>造訪 <span>番茄小說網</span> 找到您想閱讀的小說。</p>
          <a href="https://fanqienovel.com" target="_blank" rel="noopener noreferrer" className="link-button">
            前往番茄小說網
          </a>
        </HelpCard>
        <HelpCard>
          <h3>獲取 bookId</h3>
          <p>在小說詳情頁的 URL 中找到那一串數字：</p>
          <div className="code-box">
            .../page/<span>123456789</span>?...
          </div>
        </HelpCard>
        <HelpCard>
          <h3>加入書籍</h3>
          <p>在輸入框中輸入書籍 ID 或小說網址即可開始閱讀。</p>
        </HelpCard>
        <HelpCard>
          <h3>Non-Chinese Readers?</h3>
          <p>Use Google Translate or AI translation plugins in your browser to translate this site.</p>
        </HelpCard>
      </HelpGrid>
    </Section>
  );
}

export default Help;
