import React, { useState, useRef, useCallback, useEffect } from 'react';
import styled, { css } from 'styled-components';

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  align-items: stretch;

  @media (max-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const SortableItem = styled.div`
  position: relative;
  z-index: ${(p) => (p.$isDragging ? 1 : 'auto')};

  ${(p) => p.$isGrid && css`
    display: flex;
    flex-direction: column;
    min-height: 0;

    & > * {
      flex: 1;
      width: 100%;
      min-height: 0;
    }
  `}

  &::after {
    content: '';
    display: ${(p) => (p.$showDropIndicator ? 'block' : 'none')};
    position: absolute;
    inset: -3px;
    border: 3px solid var(--accent-color);
    box-shadow: 0 0 8px var(--accent-color);
    pointer-events: none;
    z-index: 3;
  }
`;

function getTargetIndexList(clientY, itemRefs, skipIndex) {
  const refs = itemRefs.current;
  for (let i = 0; i < refs.length; i++) {
    if (i === skipIndex) continue;
    const el = refs[i];
    if (!el) continue;
    const { top, height } = el.getBoundingClientRect();
    if (clientY < top + height / 2) return i;
  }
  for (let i = refs.length - 1; i >= 0; i--) {
    if (i === skipIndex) continue;
    if (refs[i]) return i;
  }
  return skipIndex ?? 0;
}

function getTargetIndexGrid(clientX, clientY, itemRefs, skipIndex) {
  const refs = itemRefs.current;
  for (let i = 0; i < refs.length; i++) {
    if (i === skipIndex) continue;
    const el = refs[i];
    if (!el) continue;
    const { left, top, width, height } = el.getBoundingClientRect();
    if (clientX >= left && clientX <= left + width && clientY >= top && clientY <= top + height) {
      return i;
    }
  }

  let best = skipIndex ?? 0;
  let bestDist = Infinity;
  for (let i = 0; i < refs.length; i++) {
    if (i === skipIndex) continue;
    const el = refs[i];
    if (!el) continue;
    const { left, top, width, height } = el.getBoundingClientRect();
    const cx = left + width / 2;
    const cy = top + height / 2;
    const dist = (clientX - cx) ** 2 + (clientY - cy) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

function SortableBooks({ items, getKey, onReorder, renderItem, layout = 'list' }) {
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const itemRefs = useRef([]);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const hasMoved = useRef(false);
  const activePointerId = useRef(null);
  const suppressClickUntil = useRef(0);
  const isGrid = layout === 'grid';

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, items.length);
  }, [items.length]);

  const endDrag = useCallback(async () => {
    const from = draggingIndex;
    const to = overIndex;
    setDraggingIndex(null);
    setOverIndex(null);
    activePointerId.current = null;
    document.body.style.overflow = '';
    document.body.style.touchAction = '';

    if (hasMoved.current) {
      suppressClickUntil.current = Date.now() + 400;
    }

    if (from != null && to != null && from !== to) {
      await onReorder(from, to);
    }
  }, [draggingIndex, overIndex, onReorder]);

  useEffect(() => {
    if (draggingIndex == null) return undefined;

    const onPointerMove = (e) => {
      if (activePointerId.current != null && e.pointerId !== activePointerId.current) return;
      if (
        Math.abs(e.clientX - dragStartX.current) > 4
        || Math.abs(e.clientY - dragStartY.current) > 4
      ) {
        hasMoved.current = true;
      }
      setOverIndex(
        isGrid
          ? getTargetIndexGrid(e.clientX, e.clientY, itemRefs, draggingIndex)
          : getTargetIndexList(e.clientY, itemRefs, draggingIndex)
      );
    };

    const onPointerUp = (e) => {
      if (activePointerId.current != null && e.pointerId !== activePointerId.current) return;
      void endDrag();
    };

    const onPointerCancel = () => {
      setDraggingIndex(null);
      setOverIndex(null);
      activePointerId.current = null;
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerCancel);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerCancel);
    };
  }, [draggingIndex, endDrag, isGrid]);

  const startDrag = useCallback((index, e) => {
    e.preventDefault();
    e.stopPropagation();
    hasMoved.current = false;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    activePointerId.current = e.pointerId;
    setDraggingIndex(index);
    setOverIndex(index);
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }, []);

  const canClick = useCallback(() => Date.now() > suppressClickUntil.current, []);

  const Container = isGrid ? Grid : List;

  return (
    <Container>
      {items.map((item, index) => (
        <SortableItem
          key={getKey(item)}
          ref={(el) => { itemRefs.current[index] = el; }}
          $isGrid={isGrid}
          $isDragging={draggingIndex === index}
          $showDropIndicator={draggingIndex != null && overIndex === index && draggingIndex !== index}
        >
          {renderItem(item, {
            dragHandleProps: {
              onPointerDown: (e) => startDrag(index, e),
              onClick: (e) => e.stopPropagation(),
            },
            isDragging: draggingIndex === index,
            canClick,
            reorderMode: true,
          })}
        </SortableItem>
      ))}
    </Container>
  );
}

export default SortableBooks;
