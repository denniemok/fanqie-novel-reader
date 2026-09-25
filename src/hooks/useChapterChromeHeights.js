import { useLayoutEffect } from 'react';

const TOP_VAR = '--chapter-top-bar-height';
const BOTTOM_VAR = '--chapter-bottom-bar-height';

function syncChromeHeights(container) {
  const top = container.firstElementChild;
  const bottom = container.lastElementChild;
  const root = document.documentElement;

  if (!top || !bottom || top === bottom) {
    root.style.removeProperty(TOP_VAR);
    root.style.removeProperty(BOTTOM_VAR);
    return;
  }

  root.style.setProperty(TOP_VAR, `${top.offsetHeight}px`);
  root.style.setProperty(BOTTOM_VAR, `${bottom.offsetHeight}px`);
}

/**
 * Publishes measured chapter top/bottom bar heights as CSS variables for fixed overlays
 * (e.g. ReaderControlsPanel). Expects the first and last child of `containerRef` to be those bars.
 */
export function useChapterChromeHeights(containerRef, enabled = true) {
  useLayoutEffect(() => {
    if (!enabled) return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    const update = () => syncChromeHeights(container);

    update();
    const observer = new ResizeObserver(update);
    const top = container.firstElementChild;
    const bottom = container.lastElementChild;
    if (top) observer.observe(top);
    if (bottom && bottom !== top) observer.observe(bottom);

    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty(TOP_VAR);
      document.documentElement.style.removeProperty(BOTTOM_VAR);
    };
  }, [containerRef, enabled]);
}
