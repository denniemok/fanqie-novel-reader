import React from 'react';
import styled from 'styled-components';
import { Globe, Library } from 'lucide-react';
import { GrayButton } from '../ui/GrayButton';
import DiscoverSection from './DiscoverSection';

const HelpGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 780px) {
    grid-template-columns: 1fr;
  }
`;

const HelpCard = styled.div`
  padding: 20px;
  background-color: var(--background-color2);
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
`;

const linkButtonStyles = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  font-size: 13px;
  padding: 12px 14px;
  line-height: 1.2;
  text-align: center;

  svg {
    width: 15px;
    height: 15px;
    flex-shrink: 0;
  }
`;

const ExternalLinkButton = styled(GrayButton).attrs({ as: 'a' })`
  ${linkButtonStyles}
`;

const LinkButtonRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

function DiscoverHelp({ embedded = false }) {
  const content = (
    <HelpGrid>
      <HelpCard>
        <h3>尋找書籍</h3>
        <p>造訪 <span>番茄小說網</span> 或 <span>Tomato MTL</span> 找到想閱讀的小說。</p>
        <LinkButtonRow>
          <ExternalLinkButton href="https://fanqienovel.com" target="_blank" rel="noopener noreferrer">
            <Globe aria-hidden />
            番茄小說網
          </ExternalLinkButton>
          <ExternalLinkButton href="https://tomatomtl.com" target="_blank" rel="noopener noreferrer">
            <Library aria-hidden />
            TomatoMTL
          </ExternalLinkButton>
        </LinkButtonRow>
      </HelpCard>
      <HelpCard>
        <h3>獲取書籍 ID</h3>
        <p>在小說詳情頁的網址中找到那一串數字：</p>
        <div className="code-box">
          https://fanqienovel.com/page/<span>123456789</span>?...
        </div>
        <div className="code-box">
          https://tomatomtl.com/book/<span>123456789</span>
        </div>
      </HelpCard>
    </HelpGrid>
  );

  return embedded ? content : <DiscoverSection>{content}</DiscoverSection>;
}

export default DiscoverHelp;
