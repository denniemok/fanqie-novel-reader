import { HorizontalScrollArea } from '../ui/HorizontalScrollArea';
import { SecondaryTabBar } from './styles';

export function ScrollableSecondaryTabBar({ children, ...rest }) {
  return (
    <HorizontalScrollArea as={SecondaryTabBar} {...rest}>
      {children}
    </HorizontalScrollArea>
  );
}
