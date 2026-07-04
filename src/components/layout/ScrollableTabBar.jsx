import { HorizontalScrollArea } from '../ui/HorizontalScrollArea';
import { TabBar } from './BookToolbarStyles';

export function ScrollableTabBar({ children, ...rest }) {
  return (
    <HorizontalScrollArea as={TabBar} {...rest}>
      {children}
    </HorizontalScrollArea>
  );
}
