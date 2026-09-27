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

/**
 * Pins a full-screen shell to the visible viewport. Safari keeps fixed boxes inside the
 * area its toolbars leave free, wherever they sit, so no gap opens when they expand or collapse.
 */
export const fixedViewport = css`
  position: fixed;
  inset: 0;
`;

export const safeAreaInsetBottom = css`
  padding-bottom: var(--safe-area-bottom, env(safe-area-inset-bottom, 0px));
`;

/**
 * In-flow chapter bottom nav. Escapes the global border-box rule so safe-area padding
 * adds to the box instead of squeezing the bar content height.
 */
export const chapterBottomBar = (contentHeight = 56) => css`
  box-sizing: content-box;
  height: ${contentHeight}px;
  ${safeAreaInsetBottom}
`;

/** Floating controls above the bottom edge (manage bar, FABs). */
export const floatingBottom = (gap = '16px') => css`
  bottom: calc(${gap} + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)));
`;
