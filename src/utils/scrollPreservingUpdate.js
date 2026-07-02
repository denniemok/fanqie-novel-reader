import { flushSync } from 'react-dom';

/** Runs an async task, applies state updates without losing scroll position. */
export async function scrollPreservingUpdate(task, applyState) {
  const scrollY = window.scrollY;
  const result = await task();
  flushSync(() => {
    applyState(result);
  });
  window.scrollTo(0, scrollY);
  return result;
}
