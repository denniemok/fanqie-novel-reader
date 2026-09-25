import { useCallback, useEffect, useRef, useState } from 'react';
import { convertHeicCoverUrl, coverDisplayAttempts } from '../../utils/book/coverUrl';

function queueFor(url, fallbackUrl) {
  const queue = coverDisplayAttempts(url);
  if (fallbackUrl && fallbackUrl !== url) {
    queue.push(...coverDisplayAttempts(fallbackUrl));
  }
  return queue;
}

export function useCoverImageSrc(url, fallbackUrl = null) {
  const initialQueue = queueFor(url, fallbackUrl);
  const first = initialQueue[0];
  const [src, setSrc] = useState(first?.type === 'url' ? first.src : null);
  const [loading, setLoading] = useState(first?.type === 'heic');
  const [failed, setFailed] = useState(false);
  const genRef = useRef(0);
  const queueRef = useRef(initialQueue.slice(first ? 1 : 0));

  const playNext = useCallback((gen) => {
    if (genRef.current !== gen) return;
    const next = queueRef.current.shift();
    if (!next) {
      if (genRef.current !== gen) return;
      setLoading(false);
      setSrc(null);
      setFailed(true);
      return;
    }

    if (next.type === 'url') {
      if (genRef.current !== gen) return;
      setLoading(false);
      setFailed(false);
      setSrc(next.src);
      return;
    }

    if (genRef.current !== gen) return;
    setLoading(true);
    setFailed(false);
    setSrc(null);
    void convertHeicCoverUrl(next.src).then((displayUrl) => {
      if (genRef.current !== gen) return;
      if (displayUrl) {
        setLoading(false);
        setSrc(displayUrl);
        return;
      }
      playNext(gen);
    });
  }, []);

  useEffect(() => {
    const gen = ++genRef.current;
    const queue = queueFor(url, fallbackUrl);
    const head = queue[0];
    queueRef.current = queue.slice(head ? 1 : 0);
    setFailed(false);

    if (!head) {
      setSrc(null);
      setLoading(false);
      return;
    }

    if (head.type === 'url') {
      setSrc(head.src);
      setLoading(false);
      return;
    }

    setSrc(null);
    setLoading(true);
    void convertHeicCoverUrl(head.src).then((displayUrl) => {
      if (genRef.current !== gen) return;
      if (displayUrl) {
        setLoading(false);
        setSrc(displayUrl);
        return;
      }
      playNext(gen);
    });
  }, [url, fallbackUrl, playNext]);

  const onError = useCallback(() => {
    playNext(genRef.current);
  }, [playNext]);

  return { src, loading, failed, onError };
}
