import { useRef, useCallback, useEffect } from 'react';

const DRAG_THRESHOLD_PX = 4;

export function useHorizontalDragScroll() {
  const ref = useRef(null);
  const dragState = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });

  const onMouseMove = useCallback((e) => {
    if (!dragState.current.active) return;
    const el = ref.current;
    if (!el) return;
    const dx = e.pageX - dragState.current.startX;
    if (Math.abs(dx) >= DRAG_THRESHOLD_PX) {
      dragState.current.moved = true;
    }
    el.scrollLeft = dragState.current.scrollLeft - dx;
  }, []);

  const endDrag = useCallback(() => {
    if (!dragState.current.active) return;
    dragState.current.active = false;
    document.body.style.removeProperty('user-select');
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', endDrag);
  }, [onMouseMove]);

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    const el = ref.current;
    if (!el || el.scrollWidth <= el.clientWidth) return;

    document.body.style.userSelect = 'none';

    dragState.current = {
      active: true,
      startX: e.pageX,
      scrollLeft: el.scrollLeft,
      moved: false,
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', endDrag);
  }, [endDrag, onMouseMove]);

  const onClickCapture = useCallback((e) => {
    if (!dragState.current.moved) return;
    e.preventDefault();
    e.stopPropagation();
    dragState.current.moved = false;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const onWheel = (e) => {
      if (el.scrollWidth <= el.clientWidth) return;

      const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (delta === 0) return;

      const maxScroll = el.scrollWidth - el.clientWidth;
      const canScroll = (delta > 0 && el.scrollLeft < maxScroll)
        || (delta < 0 && el.scrollLeft > 0);

      if (!canScroll) return;

      el.scrollLeft = Math.max(0, Math.min(maxScroll, el.scrollLeft + delta));
      e.preventDefault();
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return {
    ref,
    handlers: {
      onMouseDown,
      onClickCapture,
    },
  };
}
