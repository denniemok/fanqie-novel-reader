import { css } from 'styled-components';

export const viewportHeight = css`
  height: 100vh;
  height: 100svh;
  height: 100dvh;
`;

export const minViewportHeight = css`
  min-height: 100vh;
  min-height: 100svh;
  min-height: 100dvh;
`;

export const safeAreaInsetBottom = css`
  padding-bottom: var(--safe-area-bottom, env(safe-area-inset-bottom, 0px));
`;

/**
 * Flush fixed bottom bar (chapter nav, etc). Escapes the global border-box rule so the
 * safe-area padding adds to the box instead of squeezing the fixed content height.
 */
export const fixedBottomBar = (contentHeight = 56) => css`
  box-sizing: content-box;
  bottom: 0;
  height: ${contentHeight}px;
  ${safeAreaInsetBottom}
`;

/** Floating controls above the bottom edge (manage bar, FABs). */
export const floatingBottom = (gap = '16px') => css`
  bottom: calc(${gap} + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)));
`;
