import { css } from 'styled-components';

// Safari iOS: 100vh/100dvh can be shorter than the visible area; -webkit-fill-available fixes it.
export const viewportHeight = css`
  height: 100vh;
  height: 100dvh;

  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }
`;

export const minViewportHeight = css`
  min-height: 100vh;
  min-height: 100dvh;

  @supports (-webkit-touch-callout: none) {
    min-height: -webkit-fill-available;
  }
`;
