import styled from 'styled-components';

const PageWrapper = styled.div`
  min-height: 100dvh;
  min-height: 100vh;
  overflow-x: hidden;
  width: 100%;
  background-color: ${(p) => p.$backgroundColor ?? 'var(--background-color)'};
  ${(p) => p.$withBottomPadding && 'padding-bottom: env(safe-area-inset-bottom);'}
`;

export default PageWrapper;
