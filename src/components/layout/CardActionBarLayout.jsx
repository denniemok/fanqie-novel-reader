import styled, { css } from 'styled-components';
import { HorizontalScrollArea, HorizontalScrollInner } from '../ui/HorizontalScrollArea';

/** Viewports at or below this width use the card action footer instead of the overlay. */
export const CARD_ACTION_FOOTER_MAX_WIDTH = '768px';
export const CARD_ACTION_FOOTER_MEDIA_QUERY = `(max-width: ${CARD_ACTION_FOOTER_MAX_WIDTH})`;

const actionBarStyles = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 11;
  pointer-events: auto;
  overflow: visible;
`;

export const CardActionBarScrollInner = styled(HorizontalScrollInner)`
  gap: 4px;
  align-items: center;
  justify-content: flex-end;
  padding: 4px 5px 6px 4px;
`;

export function CardActionBarScroll({ children, ...rest }) {
  return (
    <HorizontalScrollArea as={CardActionBarScrollInner} {...rest}>
      {children}
    </HorizontalScrollArea>
  );
}

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
