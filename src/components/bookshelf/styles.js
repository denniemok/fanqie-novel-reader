import styled from 'styled-components';
import PageContent from '../layout/PageContent';
import { CardActionButton } from '../book/CardActionButton';
import { floatingBottom } from '../../utils/styled/viewport';

export const Wrapper = styled(PageContent)``;

export const ReorderHint = styled.div`
  font-size: 15px;
  font-family: var(--ui-font-family);
  color: var(--accent-color);
  padding: 12px 16px;
  border: 1px dashed var(--accent-color);
  background: rgba(212, 165, 116, 0.08);
  width: 100%;
  text-align: center;
  line-height: 1.55;
`;

export const BookshelfManageActionBar = styled.div`
  position: fixed;
  left: 50%;
  ${floatingBottom('16px')}
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 8px;
  padding: 9px 12px 10px;
  width: max-content;
  max-width: calc(100vw - 32px);
  box-sizing: border-box;
  background: color-mix(in srgb, var(--accent-color) 14%, var(--topbar-bg));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: var(--retro-border-width) solid color-mix(in srgb, var(--accent-color) 55%, var(--border-color));
  box-shadow: var(--topbar-shadow), var(--panel-shadow);
  border-radius: var(--border-radius-sm);
  overflow: visible;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    box-shadow: inset 0 1px 0 color-mix(in srgb, var(--accent-color) 22%, transparent);
  }

  @media (max-width: 480px) {
    gap: 6px;
    padding: 9px 10px 8px;
    max-width: calc(100vw - 24px);
  }
`;

export const BookshelfManageSelectionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-width: 0;
`;

export const BookshelfManageActionCount = styled.span`
  font-size: 14px;
  font-weight: 700;
  font-family: var(--ui-font-family);
  color: var(--accent-color);
  white-space: nowrap;
  flex-shrink: 0;
  line-height: 1.2;

  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

export const BookshelfManageSelectionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  min-width: 0;
  min-height: 0;
  border: none;
  border-radius: var(--border-radius-sm);
  background: transparent;
  color: var(--text-color);
  cursor: pointer;
  box-shadow: none;
  transition: color 0.1s, background 0.1s;

  @media (hover: hover) {
    &:hover:not(:disabled) {
      color: var(--accent-color);
      background: color-mix(in srgb, var(--accent-color) 12%, transparent);
      transform: none;
      box-shadow: none;
    }

    &:active:not(:disabled) {
      transform: none;
      box-shadow: none;
    }
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  svg {
    width: 26px;
    height: 26px;
  }
`;

export const BookshelfManageBarButton = styled(CardActionButton)`
  border-radius: 0;
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  padding: 0;
  box-sizing: border-box;

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const BookshelfManageSelectionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0;
  flex-shrink: 0;
`;

export const BookshelfManageActionButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
  min-width: 0;
  padding-top: 8px;
  border-top: 1px solid color-mix(in srgb, var(--accent-color) 28%, transparent);
`;
