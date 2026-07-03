import styled from 'styled-components';
import { shimmerStyle } from '../../utils/styled/animations';
import { SearchBar, SearchInput, TabBar, Tab, TOOLBAR_CONTROL_HEIGHT } from '../bookshelf/styles';
import { IconButton } from '../ui/IconButton';

export const SearchForm = styled.form`
  display: flex;
  align-items: stretch;
  gap: 10px;
`;

export const InlineSearchBar = styled(SearchBar)`
  flex: 1;
  min-width: 0;
  width: auto;
`;

export const SearchClearIconBtn = styled.button`
  padding: 0;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border: none;
  background: transparent;
  color: var(--text-color-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: var(--accent-color);
  }
`;

export const SearchSubmitBtn = styled.button`
  flex-shrink: 0;
  padding: 0 20px;
  min-height: 44px;
  height: 44px;
  border-radius: 0;
  border: var(--retro-border-width) solid var(--border-color);
  background: var(--accent-color);
  color: var(--text-on-accent);
  font-size: 14px;
  font-weight: 600;
  font-family: var(--ui-font-family);
  cursor: pointer;
  box-shadow: var(--retro-shadow);
  transition: var(--transition-default);

  &:hover:not(:disabled) {
    background: var(--accent-hover);
    transform: translate(-1px, -1px);
    box-shadow: var(--retro-shadow-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const TabStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 30;
  overflow: visible;
`;

export const SecondaryTabRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
`;

export const SecondaryTabBar = styled(TabBar)`
  flex: 1;
  min-width: 0;
  height: ${TOOLBAR_CONTROL_HEIGHT};
  border-radius: 0;
  background: color-mix(in srgb, var(--background-color2) 70%, transparent);
`;

export const SecondaryRefreshBtn = styled(IconButton)`
  flex-shrink: 0;
  min-width: ${TOOLBAR_CONTROL_HEIGHT};
  width: ${TOOLBAR_CONTROL_HEIGHT};
  height: ${TOOLBAR_CONTROL_HEIGHT};
  padding: 0;
  border-radius: 0;
`;

export const SecondaryTab = styled(Tab)`
  display: flex;
  align-items: center;
  height: 100%;
  min-height: 0;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
  max-width: 160px;
  border-radius: 0;
`;

export const DiscoverListCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  border-radius: var(--border-radius-sm);
  background: var(--card-surface);
  border: var(--retro-border-width) solid var(--border-color);
  cursor: pointer;
  transition: var(--transition-default);
  overflow: hidden;
  box-shadow: var(--retro-shadow);
  position: relative;

  &:hover {
    border-color: var(--accent-color);
    background-color: var(--hover-background-color);
    transform: translate(-2px, -2px);
    box-shadow: var(--retro-shadow-hover);
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: none;
  }
`;

export const DiscoverListCardBody = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  gap: 20px;
  flex: 1;
  min-width: 0;

  @media (max-width: 480px) {
    padding: 16px;
    gap: 16px;
  }
`;

export const DiscoverListCardActionOverlay = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 11;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  max-width: calc(100% - 20px);
  pointer-events: auto;
`;

export const DiscoverListCardActionFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
  padding: 6px 10px;
  border-top: 1px solid var(--border-color);
  background: var(--background-color);
  z-index: 11;
`;

export const DiscoverListSkeletonCard = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  gap: 20px;
  border-radius: var(--border-radius-sm);
  background-color: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  box-shadow: var(--retro-shadow);

  @media (max-width: 480px) {
    padding: 16px;
    gap: 16px;
  }
`;

export const ListSkeletonCover = styled.div`
  width: 100px;
  height: 134px;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
  background-color: var(--cover-bg);
  ${shimmerStyle}

  @media (max-width: 480px) {
    width: 96px;
    height: 128px;
  }
`;

export const ListSkeletonText = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
`;

export const OthersPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const DiscoverGridCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background: var(--card-surface);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: var(--retro-shadow);
  transition: var(--transition-default);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, var(--accent-soft) 0%, transparent 55%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
  }

  &:hover {
    border-color: var(--accent-color);
    background-color: var(--hover-background-color);
    transform: translate(-2px, -2px);
    box-shadow: var(--retro-shadow-hover);

    &::after {
      opacity: 0.5;
    }

    img {
      transform: scale(1.03);
    }
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: none;
  }
`;

export const CoverWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

export const CoverImg = styled.img`
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  background-color: var(--cover-bg);
  opacity: 0.9;
  border-bottom: 1px solid var(--border-color);
  display: block;
  transition: transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1);
`;

export const CoverPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  background-color: var(--cover-bg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--text-color-secondary);
`;

export const CoverMetaOverlayBottom = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  max-width: 100%;
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  pointer-events: none;
`;

export const CoverMetaLine = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: var(--text-on-accent);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  width: fit-content;
  max-width: 100%;
  box-sizing: border-box;
  padding: 3px 6px;
  background: rgba(201, 128, 154, 0.85);
  border: 1px solid rgba(255, 248, 245, 0.4);
`;

export const Info = styled.div`
  padding: 8px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-height: 62px;
  box-sizing: border-box;
`;

export const Title = styled.div`
  font-size: 13px;
  font-weight: 600;
  font-family: var(--display-font-family);
  color: var(--text-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.35;
  min-height: calc(13px * 1.35 * 2);
`;

export const Author = styled.div`
  font-size: 11px;
  color: var(--accent-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.85;
  min-height: 11px;
`;

export const DiscoverGridSkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background-color: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  box-shadow: var(--retro-shadow);
`;

export const SkeletonCover = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  ${shimmerStyle}
`;

export const SkeletonText = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SkeletonLine = styled.div`
  height: ${(p) => p.$height || '12px'};
  width: ${(p) => p.$width || '100%'};
  ${shimmerStyle}
`;
