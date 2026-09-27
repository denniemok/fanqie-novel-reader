import styled, { css } from 'styled-components';
import { toolbarRetroUnit } from '../../utils/styled/retro';
import { HorizontalScrollInner } from '../ui/HorizontalScrollArea';

export const TOOLBAR_CONTROL_HEIGHT = '44px';

export const TOOLBAR_SORT_DROPDOWN_PROPS = {
  attachedLabel: '排序',
  hideAttachedLabelOnMobile: true,
  embedded: true,
  square: true,
  retro: true,
  menuAlign: 'left',
  triggerMinWidth: 108,
  triggerMinWidthMobile: 72,
  triggerBold: true,
};

/** Rounded glass container shared by toolbar groupings; children stay transparent. */
const toolbarGroup = css`
  border-radius: var(--border-radius-sm);
  background: var(--card-surface);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  ${toolbarRetroUnit}
`;

/** Segmented-control item colours: soft accent tint when active. */
const segmentColors = css`
  background: ${(p) => (p.$active ? 'var(--accent-soft)' : 'transparent')};
  color: ${(p) => (p.$active ? 'var(--accent-color)' : 'var(--text-color-secondary)')};
  font-weight: ${(p) => (p.$active ? 600 : 500)};

  @media (hover: hover) {
    &:hover:not([disabled]) {
      background: ${(p) => (p.$active ? 'var(--accent-soft)' : 'var(--hover-background-color)')};
      color: ${(p) => (p.$active ? 'var(--accent-color)' : 'var(--text-color)')};
    }
  }
`;

export const TabBar = styled(HorizontalScrollInner)`
  align-items: stretch;
  gap: 0;
  ${toolbarGroup}
`;

/** Tab bar with trailing action buttons (e.g. manage collections, refresh) on one line. */
export const TabRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;

  > ${TabBar} {
    flex: 1;
    min-width: 0;
  }
`;

export const Tab = styled.button`
  flex-shrink: 0;
  padding: 11px 20px;
  /* Bar border adds 2px, so the bar matches TOOLBAR_CONTROL_HEIGHT. */
  min-height: calc(${TOOLBAR_CONTROL_HEIGHT} - 2px);
  border: none;
  border-right: 1px solid var(--border-color);
  font-size: 14px;
  font-family: var(--ui-font-family);
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: var(--transition-default);
  white-space: nowrap;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  ${segmentColors}
`;

export const TabInner = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  min-width: 0;
`;

export const TabName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

export const TabCount = styled.span`
  flex-shrink: 0;
  opacity: 0.85;
`;

export const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
  height: ${TOOLBAR_CONTROL_HEIGHT};
  box-sizing: border-box;
  padding: 0 14px;
  ${toolbarGroup}

  &:focus-within {
    border-color: var(--accent-color);
  }

  svg.search-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: var(--text-color-secondary);
  }
`;

export const SearchRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
  width: 100%;
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--text-color);
  font-size: 14px;
  font-family: var(--ui-font-family);
  outline: none;

  &::-webkit-search-cancel-button,
  &::-webkit-search-decoration {
    -webkit-appearance: none;
    display: none;
  }

  &[type='search'] {
    -webkit-appearance: none;
    appearance: none;
  }

  &::placeholder {
    color: var(--text-color-secondary);
    opacity: 0.55;
  }
`;

export const SearchClearBtn = styled.button`
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

export const TabActions = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  min-height: ${TOOLBAR_CONTROL_HEIGHT};
  width: 100%;
`;

export const ToolbarRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 30;
`;

export const ViewToggle = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0;
  height: ${TOOLBAR_CONTROL_HEIGHT};
  box-sizing: border-box;
  overflow: hidden;
  ${toolbarGroup}
`;

export const ToolbarRight = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
  flex: 1 1 100%;
  max-width: 100%;
`;

export const SortUnit = styled.div`
  display: inline-flex;
  align-items: stretch;
  height: ${TOOLBAR_CONTROL_HEIGHT};
  box-sizing: border-box;
  overflow: visible;
  margin-right: auto;
  ${toolbarGroup}
`;

export const SortTrailingBtn = styled.button`
  padding: 0 12px;
  height: 100%;
  box-sizing: border-box;
  border: none;
  border-left: 1px solid var(--border-color);
  border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-shrink: 0;
  font-size: 14px;
  font-family: var(--ui-font-family);
  line-height: 1;
  white-space: nowrap;
  transition: var(--transition-default);
  ${segmentColors}

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  @media (max-width: 480px) {
    min-width: ${TOOLBAR_CONTROL_HEIGHT};
    width: ${TOOLBAR_CONTROL_HEIGHT};
    padding: 0;
    gap: 0;
    flex-shrink: 0;
  }
`;

export const BtnLabel = styled.span`
  @media (max-width: 480px) {
    display: none;
  }
`;

export const ToggleBtn = styled.button`
  padding: 0 14px;
  height: 100%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  font-family: var(--ui-font-family);
  line-height: 1;
  transition: var(--transition-default);
  ${segmentColors}

  svg {
    width: 16px;
    height: 16px;
  }

  &:not(:last-child) {
    border-right: 1px solid var(--border-color);
  }

  @media (max-width: 480px) {
    min-width: ${TOOLBAR_CONTROL_HEIGHT};
    width: ${TOOLBAR_CONTROL_HEIGHT};
    padding: 0;
    gap: 0;
    flex-shrink: 0;
  }
`;
