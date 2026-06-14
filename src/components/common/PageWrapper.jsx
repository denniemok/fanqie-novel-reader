import styled from 'styled-components';

const PageWrapper = styled.div`
  min-height: 100vh;
  min-height: 100dvh;
  overflow-x: hidden;
  width: 100%;
  background-color: ${(p) => p.$backgroundColor ?? 'var(--background-color)'};
  ${(p) => p.$withBottomPadding && 'padding-bottom: env(safe-area-inset-bottom);'}

  @supports (-webkit-touch-callout: none) {
    min-height: -webkit-fill-available;
  }
`;

export default PageWrapper;
