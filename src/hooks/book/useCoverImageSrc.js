import { useCallback, useEffect, useRef, useState } from 'react';
import { convertHeicCoverUrl, coverDisplayAttempts } from '../../utils/book/coverUrl';

/** Delays before re-running every attempt after all of them failed (transient CDN / network errors). */
const RETRY_DELAYS_MS = [1500, 4000, 10000];

function queueFor(url, fallbackUrl) {
  const queue = coverDisplayAttempts(url);
  if (fallbackUrl && fallbackUrl !== url) {
    queue.push(...coverDisplayAttempts(fallbackUrl));
  }
  return queue;
}

/**
 * Resolves a displayable cover src, walking the attempt queue on errors.
 * A failure is never final: the queue is retried with backoff, and again when the
 * network comes back or the tab becomes visible, so one bad load cannot stick.
 * `attemptKey` changes on every run; key the <img> with it so the browser re-requests.
 */
export function useCoverImageSrc(url, fallbackUrl = null) {
  const initialHead = queueFor(url, fallbackUrl)[0];
  const [src, setSrc] = useState(initialHead?.type === 'url' ? initialHead.src : null);
  const [loading, setLoading] = useState(initialHead?.type === 'heic');
  const [failed, setFailed] = useState(false);
  const [attemptKey, setAttemptKey] = useState(1);
  const genRef = useRef(0);
  const queueRef = useRef([]);
  const retriesRef = useRef(0);
  const retryTimerRef = useRef(null);
  const startRef = useRef(() => {});
  const sourcesRef = useRef({ url, fallbackUrl });
  sourcesRef.current = { url, fallbackUrl };

  const clearRetryTimer = () => {
    clearTimeout(retryTimerRef.current);
    retryTimerRef.current = null;
  };

  const play = useCallback((gen) => {
    if (genRef.current !== gen) return;
    const next = queueRef.current.shift();

    if (!next) {
      const delay = RETRY_DELAYS_MS[retriesRef.current];
      if (delay == null) {
        setLoading(false);
        setSrc(null);
        setFailed(true);
        return;
      }
      retriesRef.current += 1;
      // Show the placeholder while waiting instead of the broken image.
      setSrc(null);
      setLoading(true);
      retryTimerRef.current = setTimeout(() => startRef.current(), delay);
      return;
    }

    if (next.type === 'url') {
      setLoading(false);
      setSrc(next.src);
      return;
    }

    setLoading(true);
    setSrc(null);
    void convertHeicCoverUrl(next.src).then((displayUrl) => {
      if (genRef.current !== gen) return;
      if (displayUrl) {
        setLoading(false);
        setSrc(displayUrl);
        return;
      }
      play(gen);
    });
  }, []);

  /** Begin a fresh pass over every attempt (new generation, new <img> key). */
  const start = useCallback(() => {
    clearRetryTimer();
    const gen = ++genRef.current;
    const { url: u, fallbackUrl: f } = sourcesRef.current;
    queueRef.current = queueFor(u, f);
    setFailed(false);
    setAttemptKey(gen);
    if (!queueRef.current.length) {
      setSrc(null);
      setLoading(false);
      return;
    }
    play(gen);
  }, [play]);
  startRef.current = start;

  useEffect(() => {
    retriesRef.current = 0;
    start();
    return clearRetryTimer;
  }, [url, fallbackUrl, start]);

  // Recover covers that exhausted their retries once the network or tab comes back.
  useEffect(() => {
    if (!failed) return undefined;
    const retry = () => {
      retriesRef.current = 0;
      start();
    };
    const retryWhenVisible = () => {
      if (document.visibilityState === 'visible') retry();
    };
    window.addEventListener('online', retry);
    document.addEventListener('visibilitychange', retryWhenVisible);
    return () => {
      window.removeEventListener('online', retry);
      document.removeEventListener('visibilitychange', retryWhenVisible);
    };
  }, [failed, start]);

  const onError = useCallback(() => {
    play(genRef.current);
  }, [play]);

  return { src, loading, failed, onError, attemptKey };
}
