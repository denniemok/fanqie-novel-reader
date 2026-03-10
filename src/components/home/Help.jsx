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
  font-size: 16px;
  font-weight: 900;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--background-color2);
  padding: 7px 12px;
  border: 1px solid var(--border-color);
  width: fit-content;
  box-shadow: 2px 2px 0px var(--background-color);

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
  border-radius: 0;
  border: var(--retro-border-width) solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: var(--retro-shadow);

  h3 {
    font-size: 16px;
    font-weight: 900;
    margin: 0;
    color: var(--text-color);
    text-transform: uppercase;
    font-family: inherit;
  }

  p {
    font-size: 13px;
    color: var(--text-color-secondary);
    line-height: 1.6;
    margin: 0;
    font-family: inherit;

    span {
      color: var(--accent-color);
      font-weight: 900;
    }
  }

  .code-box {
    padding: 10px 14px;
    background-color: var(--background-color);
    border-radius: 0;
    font-family: inherit;
    font-size: 12px;
    color: var(--text-color-secondary);
    overflow-x: auto;
    border: 1px solid var(--border-color);

    span {
      color: var(--accent-color);
      font-weight: 900;
    }
  }

  a.link-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    border-radius: 0;
    background-color: var(--accent-color);
    color: #000;
    font-size: 14px;
    font-weight: 900;
    text-decoration: none;
    transition: all 0.1s steps(2);
    align-self: flex-start;
    text-transform: uppercase;
    border: 2px solid #000;
    box-shadow: 4px 4px 0px #000;

    &:hover {
      background-color: var(--accent-hover);
      transform: translate(-2px, -2px);
      box-shadow: 6px 6px 0px #000;
    }

    &:active {
      transform: translate(1px, 1px);
      box-shadow: 0px 0px 0px #000;
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
          <h3>獲取書籍 ID</h3>
          <p>在小說詳情頁的網址中找到那一串數字：</p>
          <div className="code-box">
            .../page/<span>123456789</span>?...
          </div>
        </HelpCard>
        <HelpCard>
          <h3>加入書籍</h3>
          <p>在輸入框中輸入 <span>書籍 ID</span> 或 <span>小說網址</span> 即可開始閱讀。</p>
        </HelpCard>
        <HelpCard>
          <h3>開發初衷</h3>
          <p>免除手機號登錄 · 粉碎無效廣告擾<br />
          為繁體閱讀而生 · 讓小說回歸純粹<br /></p>
        </HelpCard>
      </HelpGrid>
    </Section>
  );
}

export default Help;
