import styled from 'styled-components';
import { shimmerStyle } from '../../utils/styled/animations';
import { bookCardSurface, bookCardCoverZoom, bookCoverImage, coverMetaBadge, bookCardTitle, bookCardAuthor } from '../../utils/styled/bookCard';
import { SearchBar, TabBar, TabRow, Tab, TOOLBAR_CONTROL_HEIGHT } from '../layout/BookToolbarStyles';
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
  border-radius: var(--border-radius-sm);
  border: var(--retro-border-width) solid var(--accent-color);
  background: var(--accent-color);
  color: var(--text-on-accent);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.1em;
  font-family: var(--ui-font-family);
  cursor: pointer;
  transition: var(--transition-default);

  &:hover:not(:disabled) {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
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

export const SecondaryTabRow = TabRow;

export const SecondaryTabBar = styled(TabBar)`
  flex: 1;
  min-width: 0;
  height: ${TOOLBAR_CONTROL_HEIGHT};
`;

export const SecondaryRefreshBtn = styled(IconButton)`
  flex-shrink: 0;
  min-width: ${TOOLBAR_CONTROL_HEIGHT};
  width: ${TOOLBAR_CONTROL_HEIGHT};
  height: ${TOOLBAR_CONTROL_HEIGHT};
  padding: 0;
`;

export const SecondaryTab = styled(Tab)`
  display: flex;
  align-items: center;
  height: 100%;
  min-height: 0;
  padding: 0 16px;
  font-size: 13px;
  letter-spacing: 0.06em;
  max-width: 160px;
`;

export const DiscoverListCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  ${bookCardSurface}
  cursor: pointer;
  overflow: hidden;
  position: relative;
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

export const DiscoverListSkeletonCard = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  gap: 20px;
  border-radius: var(--border-radius);
  background-color: var(--card-surface);
  border: var(--retro-border-width) solid var(--border-color);

  @media (max-width: 480px) {
    padding: 16px;
    gap: 16px;
  }
`;

export const ListSkeletonCover = styled.div`
  width: 100px;
  height: 134px;
  flex-shrink: 0;
  border-radius: var(--border-radius-xs);
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
  ${bookCardSurface}
  ${bookCardCoverZoom}
  cursor: pointer;
  position: relative;
  overflow: hidden;
`;

export const CoverWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

export const CoverImg = styled.img`
  ${bookCoverImage}
`;

export const CoverPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  background-color: var(--cover-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--text-color-secondary);
`;

export const CoverMetaOverlayBottom = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  max-width: 100%;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  pointer-events: none;
`;

export const CoverMetaLine = styled.div`
  ${coverMetaBadge}
`;

export const Info = styled.div`
  padding: 12px 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-sizing: border-box;
`;

export const Title = styled.div`
  ${bookCardTitle}
`;

export const Author = styled.div`
  ${bookCardAuthor}
`;

export const DiscoverGridSkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background-color: var(--card-surface);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius);
  overflow: hidden;
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

export const SearchResultCapHint = styled.p`
  margin: 16px 0 0;
  font-size: 13px;
  color: var(--text-color-secondary);
  text-align: center;
  opacity: 0.75;
`;
