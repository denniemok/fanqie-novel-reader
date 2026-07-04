import styled from 'styled-components';
import { useHorizontalDragScroll } from '../../hooks/useHorizontalDragScroll';

export const HorizontalScrollInner = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x;
  max-width: 100%;
  min-width: 0;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

export function HorizontalScrollArea({ as: Component = HorizontalScrollInner, children, ...rest }) {
  const { ref, handlers } = useHorizontalDragScroll();

  return (
    <Component ref={ref} {...handlers} {...rest}>
      {children}
    </Component>
  );
}
