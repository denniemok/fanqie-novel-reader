import styled, { css } from 'styled-components';
import { minViewportHeight, viewportHeight } from '../../utils/styled/viewport';

const PageWrapper = styled.div`
  ${(p) => (p.$fillViewport ? viewportHeight : minViewportHeight)}
  overflow-x: hidden;
  width: 100%;
  background-color: ${(p) => p.$backgroundColor ?? 'transparent'};
  ${(p) => p.$withBottomPadding && 'padding-bottom: var(--safe-area-bottom, env(safe-area-inset-bottom, 0px));'}
  ${(p) => p.$fillViewport && css`
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `}
`;

export default PageWrapper;
