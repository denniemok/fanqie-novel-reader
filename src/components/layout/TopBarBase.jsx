import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SettingsButton from '../settings/SettingsButton';
import ActionBar from './ActionBar';
import BrandSeal from '../ui/BrandSeal';
import { ROUTES } from '../../utils/navigation';

const TopBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 24px;
  padding-top: calc(10px + env(safe-area-inset-top));
  background-color: var(--topbar-bg);
  backdrop-filter: saturate(1.4) blur(20px);
  -webkit-backdrop-filter: saturate(1.4) blur(20px);
  border-bottom: 1px solid var(--border-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: var(--topbar-shadow);

  @media (max-width: 480px) {
    padding: 10px 16px;
    padding-top: calc(10px + env(safe-area-inset-top));
  }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;
`;

const SiteTitle = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--display-font-family);
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: var(--text-color);
  text-decoration: none;
  white-space: nowrap;
  border: none;
  border-radius: 0;
  padding: 0;
  background: transparent;
  flex-shrink: 0;
  transition: var(--transition-default);

  @media (hover: hover) {
    &:hover {
      color: var(--accent-color);
    }
  }
`;

const TitleSep = styled.span`
  width: 1px;
  height: 14px;
  background: var(--border-strong);
  flex-shrink: 0;
  margin: 0 4px;
`;

const PageTitleLabel = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-color-secondary);
  letter-spacing: 0.08em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1 1 auto;
`;

function TopBarBase({ pageTitle, children }) {
  return (
    <TopBarWrapper>
      <TitleGroup>
        <SiteTitle to={ROUTES.home}><BrandSeal aria-hidden>番</BrandSeal>番閱</SiteTitle>
        {pageTitle && (
          <>
            <TitleSep aria-hidden />
            <PageTitleLabel>{pageTitle}</PageTitleLabel>
          </>
        )}
      </TitleGroup>
      <ActionBar pinnedEnd={<SettingsButton />}>
        {children}
      </ActionBar>
    </TopBarWrapper>
  );
}

export default TopBarBase;
