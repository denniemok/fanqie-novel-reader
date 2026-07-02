import { useState, useEffect } from 'react';
import { detailCache } from '../../utils/cache';
import { maybeConvert } from '../../utils/text/zh-convert';

function resolveCreationStatusLabel(creationStatus) {
  if (creationStatus === '0') return '已完結';
  if (creationStatus) return '連載中';
  return '';
}

function parseWordCount(raw) {
  if (raw === '0' || raw == null || raw === '') return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

export function extractBookshelfSearchMeta(detail) {
  const d = detail || {};
  const titles = [d.book_name, d.original_book_name].filter(Boolean);
  const statusLabel = resolveCreationStatusLabel(d.creation_status);
  const statusParts = [d.creation_status, statusLabel].filter(Boolean);

  return {
    title: titles.join(' '),
    author: d.author || '',
    abstract: d.abstract || '',
    tags: d.tags || '',
    category: d.category || '',
    creationStatus: d.creation_status ?? '',
    wordCount: parseWordCount(d.word_number),
    status: statusParts.join(' '),
  };
}

export function bookMatchesBookshelfSearch(meta, bookId, query, conversionMode = 'tw') {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  if (!meta) return true;

  const haystack = [
    maybeConvert(meta.title, conversionMode),
    maybeConvert(meta.author, conversionMode),
    maybeConvert(meta.abstract, conversionMode),
    maybeConvert(meta.tags, conversionMode),
    maybeConvert(meta.category, conversionMode),
    maybeConvert(meta.status, conversionMode),
    bookId,
  ].join(' ').toLowerCase();

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
