import styled from 'styled-components';
import PageContent from '../layout/PageContent';
import { CardActionButton } from '../book/CardActionButton';

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
  bottom: calc(16px + env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  max-width: min(640px, calc(100vw - 32px));
  box-sizing: border-box;
  background: color-mix(in srgb, var(--accent-color) 14%, var(--topbar-bg));
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: var(--retro-border-width) solid color-mix(in srgb, var(--accent-color) 55%, var(--border-color));
  box-shadow: var(--topbar-shadow), var(--panel-shadow);
  border-radius: var(--border-radius-sm);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    box-shadow: inset 0 1px 0 color-mix(in srgb, var(--accent-color) 22%, transparent);
  }

  @media (max-width: 480px) {
    gap: 8px;
    padding: 8px 10px;
    max-width: calc(100vw - 24px);
  }
`;

export const BookshelfManageActionCount = styled.span`
  font-size: 14px;
  font-weight: 700;
  font-family: var(--ui-font-family);
  color: var(--accent-color);
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 3.5em;

  @media (max-width: 480px) {
    font-size: 13px;
    min-width: 3em;
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

export const BookshelfManageActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: flex-end;
  min-width: 0;
`;
