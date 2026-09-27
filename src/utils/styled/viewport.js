import { css } from 'styled-components';

/**
 * Large viewport, so the page paints under Safari's collapsing address bar
 * instead of stopping short and leaving a strip of empty space.
 * `--browser-chrome-bottom` is the covered strip, measured in index.html.
 */
const viewportBottomInset = 'max(var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)), var(--browser-chrome-bottom, 0px))';

export const viewportHeight = css`
  height: 100vh;
  height: 100lvh;
`;

export const minViewportHeight = css`
  min-height: 100vh;
  min-height: 100lvh;
`;

export const safeAreaInsetBottom = css`
  padding-bottom: ${viewportBottomInset};
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
