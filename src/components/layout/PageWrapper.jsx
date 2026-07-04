import styled from 'styled-components';
import { minViewportHeight } from '../../utils/styled/viewport';

const PageWrapper = styled.div`
  ${minViewportHeight}
  overflow-x: hidden;
  width: 100%;
  background-color: ${(p) => p.$backgroundColor ?? 'transparent'};
  ${(p) => p.$withBottomPadding && 'padding-bottom: var(--safe-area-bottom, env(safe-area-inset-bottom, 0px));'}
`;

export default PageWrapper;
