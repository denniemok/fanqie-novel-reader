import { useState, useEffect } from 'react';
import { detailCache, directoryCache } from '../utils/cache';
import { extractBookshelfSortMeta } from '../utils/bookshelfSort';

export function useBookshelfSortMeta(bookIds, sortBy) {
  const [metaMap, setMetaMap] = useState({});

  useEffect(() => {
    if (sortBy === 'manual' || !bookIds.length) {
      setMetaMap({});
      return undefined;
    }

    let cancelled = false;

    (async () => {
      const entries = await Promise.all(
        bookIds.map(async (bookId) => {
          const [detail, directory] = await Promise.all([
            detailCache.get(bookId),
            directoryCache.get(bookId),
          ]);
          return [bookId, extractBookshelfSortMeta(detail, directory)];
        })
      );
      if (!cancelled) {
        setMetaMap(Object.fromEntries(entries));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bookIds.join(','), sortBy]);

  return metaMap;
}
