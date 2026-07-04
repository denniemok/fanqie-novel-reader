import { useCallback, useEffect, useRef, useState } from 'react';
import { convertHeicCoverUrl, isHeicCoverUrl } from '../../utils/book/coverUrl';

export function useCoverImageSrc(url) {
  const [src, setSrc] = useState(url || null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const triedConvertRef = useRef(false);
  const activeUrlRef = useRef(url);

  useEffect(() => {
    activeUrlRef.current = url;
    triedConvertRef.current = false;
    setSrc(url || null);
    setLoading(false);
    setFailed(false);
  }, [url]);

  const onError = useCallback(() => {
    const currentUrl = activeUrlRef.current;
    if (!currentUrl || triedConvertRef.current) {
      setFailed(true);
      return;
    }

    triedConvertRef.current = true;

    if (!isHeicCoverUrl(currentUrl)) {
      setFailed(true);
      return;
    }

    setLoading(true);

    void convertHeicCoverUrl(currentUrl).then((displayUrl) => {
      if (activeUrlRef.current !== currentUrl) return;
      setLoading(false);
      if (displayUrl) {
        setSrc(displayUrl);
      } else {
        setFailed(true);
      }
    });
  }, []);

  return { src, loading, failed, onError };
}
