import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SettingsButton from '../settings/SettingsButton';
import BackButton from '../navigation/BackButton';
import ForwardButton from '../navigation/ForwardButton';
import ActionBar from './ActionBar';
import { ROUTES } from '../../utils/navigation';

const TopBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  padding-top: calc(12px + env(safe-area-inset-top));
  background-color: var(--topbar-bg);
  backdrop-filter: blur(12px);
  border-bottom: var(--retro-border-width) dashed var(--border-color);
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
  gap: 6px;
  min-width: 0;
  flex: 1;
`;

const SiteTitle = styled(Link)`
  font-family: var(--display-font-family);
  font-size: 17px;
  font-weight: 600;
  color: var(--accent-color);
  text-decoration: none;
  white-space: nowrap;
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: 6px 12px;
  background: var(--background-color2);
  flex-shrink: 0;
  transition: var(--transition-default);
  box-shadow: var(--retro-shadow);

  &:hover {
    background: var(--accent-color);
    color: var(--text-on-accent);
    border-color: var(--accent-color);
    transform: rotate(-1deg);
  }
`;

const TitleSep = styled.span`
  color: var(--text-color-secondary);
  font-size: 14px;
  opacity: 0.4;
  flex-shrink: 0;
`;

const PageTitleLabel = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: var(--text-color-secondary);
  letter-spacing: 0.04em;
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
        <SiteTitle to={ROUTES.home}>番茄繁體閱讀</SiteTitle>
        {pageTitle && (
          <>
            <TitleSep>›</TitleSep>
            <PageTitleLabel>{pageTitle}</PageTitleLabel>
          </>
        )}
      </TitleGroup>
      <ActionBar
        pinnedStart={
          <>
            <BackButton />
            <ForwardButton />
          </>
        }
        pinnedEnd={<SettingsButton />}
      >
        {children}
      </ActionBar>
    </TopBarWrapper>
  );
}

export default TopBarBase;
