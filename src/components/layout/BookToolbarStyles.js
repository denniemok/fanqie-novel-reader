import styled from 'styled-components';
import { toolbarRetroUnit } from '../../utils/styled/retro';
import { HorizontalScrollInner } from '../ui/HorizontalScrollArea';

export const TOOLBAR_CONTROL_HEIGHT = '44px';

export const TabBar = styled(HorizontalScrollInner)`
  align-items: stretch;
  gap: 0;
  ${toolbarRetroUnit}
`;

export const Tab = styled.button`
  flex-shrink: 0;
  padding: 13px 18px;
  min-height: 44px;
  background: ${(p) => (p.$active ? 'var(--accent-color)' : 'var(--background-color2)')};
  color: ${(p) => (p.$active ? 'var(--text-on-accent)' : 'var(--text-color-secondary)')};
  border: none;
  border-right: 1px solid var(--border-color);
  font-size: 14px;
  font-weight: 700;
  font-family: var(--ui-font-family);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.1s steps(2);
  white-space: nowrap;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: ${(p) => (p.$active ? 'var(--accent-hover)' : 'var(--hover-background-color)')};
    color: ${(p) => (p.$active ? 'var(--text-on-accent)' : 'var(--text-color)')};
  }
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
  padding: 0 12px;
  background: color-mix(in srgb, var(--background-color2) 48%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  ${toolbarRetroUnit}

  &:focus-within {
    border-color: var(--accent-color);
    transform: translate(-1px, -1px);
    box-shadow: var(--retro-shadow-hover);
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
  ${toolbarRetroUnit}
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
  border-radius: 0;
  overflow: visible;
  margin-right: auto;
  ${toolbarRetroUnit}
`;

export const SortTrailingBtn = styled.button`
  padding: 0 12px;
  height: 100%;
  box-sizing: border-box;
  background: ${(p) => (p.$active ? 'var(--accent-color)' : 'var(--background-color2)')};
  color: ${(p) => (p.$active ? 'var(--text-on-accent)' : 'var(--accent-color)')};
  border: none;
  border-left: 1px solid var(--border-color);
  border-radius: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
  font-family: var(--ui-font-family);
  line-height: 1;
  white-space: nowrap;
  transition: background 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &:hover {
    background: ${(p) => (p.$active ? 'var(--accent-hover)' : 'var(--hover-background-color)')};
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
  background: ${(p) => (p.$active ? 'var(--accent-color)' : 'var(--background-color2)')};
  color: ${(p) => (p.$active ? 'var(--text-on-accent)' : 'var(--text-color-secondary)')};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  font-family: var(--ui-font-family);
  line-height: 1;
  transition: all 0.1s steps(2);

  svg {
    width: 16px;
    height: 16px;
  }

  &:not(:last-child) {
    border-right: 1px solid var(--border-color);
  }

  &:hover:not([disabled]) {
    background: ${(p) => (p.$active ? 'var(--accent-hover)' : 'var(--hover-background-color)')};
  }

  @media (max-width: 480px) {
    min-width: ${TOOLBAR_CONTROL_HEIGHT};
    width: ${TOOLBAR_CONTROL_HEIGHT};
    padding: 0;
    gap: 0;
    flex-shrink: 0;
  }
`;
