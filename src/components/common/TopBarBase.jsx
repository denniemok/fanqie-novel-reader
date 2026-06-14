import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ActionBar from './ActionBar';

const TopBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  padding-top: calc(12px + env(safe-area-inset-top));
  background-color: var(--background-color);
  border-bottom: var(--retro-border-width) solid var(--border-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);

  @media (max-width: 480px) {
    padding: 10px 16px;
    padding-top: calc(10px + env(safe-area-inset-top));
  }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex: 1;
  overflow: hidden;
`;

const SiteTitle = styled(Link)`
  font-size: 18px;
  font-weight: 900;
  color: var(--text-color);
  text-decoration: none;
  white-space: nowrap;
  text-transform: uppercase;
  border: 1px solid var(--border-color);
  padding: 6px 8px;
  background: var(--background-color2);
  flex-shrink: 0;

  &:hover {
    background: var(--accent-color);
    color: #000;
    border-color: var(--accent-color);
  }

  @media (max-width: 374px) {
    font-size: 15px;
    padding: 5px 6px;
  }
`;

const TitleSep = styled.span`
  color: var(--text-color-secondary);
  font-size: 14px;
  opacity: 0.4;
  flex-shrink: 0;
`;

const PageTitleLabel = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 374px) {
    font-size: 13px;
  }
`;

function TopBarBase({ pageTitle, children }) {
  return (
    <TopBarWrapper>
      <TitleGroup>
        <SiteTitle to="/">番茄繁體閱讀</SiteTitle>
        {pageTitle && (
          <>
            <TitleSep>›</TitleSep>
            <PageTitleLabel>{pageTitle}</PageTitleLabel>
          </>
        )}
      </TitleGroup>
      <ActionBar>
        {children}
      </ActionBar>
    </TopBarWrapper>
  );
}

export default TopBarBase;
