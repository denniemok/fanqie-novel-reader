import { useState, useEffect } from 'react';
import { detailCache } from '../../utils/cache';
import { extractBookshelfSortMeta } from '../../utils/book/bookshelfSort';

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
          const detail = await detailCache.get(bookId);
          return [bookId, extractBookshelfSortMeta(detail)];
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
