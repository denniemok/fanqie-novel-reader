import styled, { css } from 'styled-components';

const actionBarStyles = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 11;
  pointer-events: auto;
  overflow: visible;
`;

export const CardActionBarScroll = styled.div`
  display: flex;
  flex-wrap: nowrap;
  gap: 4px;
  align-items: center;
  justify-content: flex-end;
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  padding: 4px 5px 6px 4px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const CardActionOverlay = styled.div`
  ${actionBarStyles}
  position: absolute;
  top: 10px;
  right: 10px;
  max-width: calc(100% - 20px);
`;

export const CardActionFooter = styled.div`
  ${actionBarStyles}
  flex-shrink: 0;
  padding: 6px 10px 6px;
  border-top: 1px solid var(--border-color);
  background: var(--background-color);
`;

/** Stops click/touch propagation for nested action buttons on cards. */
export const cardActionBarHandlers = {
  onClick: (e) => e.stopPropagation(),
  onTouchStart: (e) => e.stopPropagation(),
};
