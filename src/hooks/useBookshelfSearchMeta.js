import { useState, useEffect } from 'react';
import { detailCache } from '../utils/cache';
import { maybeConvert } from '../utils/zh-convert';

export function extractBookshelfSearchMeta(detail) {
  const d = detail || {};
  return {
    title: d.original_book_name || '',
    author: d.author || '',
  };
}

export function bookMatchesBookshelfSearch(meta, bookId, query, conversionMode = 'tw') {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (!meta) return true;

  const title = maybeConvert(meta.title, conversionMode);
  const author = maybeConvert(meta.author, conversionMode);
  const haystack = `${title} ${author} ${bookId}`.toLowerCase();
  return haystack.includes(q);
}

export function useBookshelfSearchMeta(bookIds, refreshKey = '') {
  const [metaMap, setMetaMap] = useState({});

  useEffect(() => {
    if (!bookIds.length) {
      setMetaMap({});
      return undefined;
    }

    let cancelled = false;

    (async () => {
      const entries = await Promise.all(
        bookIds.map(async (bookId) => {
          const detail = await detailCache.get(bookId);
          return [bookId, extractBookshelfSearchMeta(detail)];
        })
      );
      if (!cancelled) {
        setMetaMap(Object.fromEntries(entries));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bookIds.join(','), refreshKey]);

  return metaMap;
}
