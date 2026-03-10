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
    padding: 8px 16px;
    padding-top: calc(8px + env(safe-area-inset-top));
  }
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

  &:hover {
    background: var(--accent-color);
    color: #000;
    border-color: var(--accent-color);
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: 5px 8px;
  }
`;

function TopBarBase({ children }) {
  return (
    <TopBarWrapper>
      <SiteTitle to="/">番茄繁體閱讀</SiteTitle>
      <ActionBar>
        {children}
      </ActionBar>
    </TopBarWrapper>
  );
}

export default TopBarBase;
