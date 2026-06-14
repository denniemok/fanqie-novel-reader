import styled from 'styled-components';
import { minViewportHeight } from '../../utils/styled/viewport';

const PageWrapper = styled.div`
  ${minViewportHeight}
  overflow-x: hidden;
  width: 100%;
  background-color: ${(p) => p.$backgroundColor ?? 'var(--background-color)'};
  ${(p) => p.$withBottomPadding && 'padding-bottom: env(safe-area-inset-bottom);'}
`;

export default PageWrapper;
