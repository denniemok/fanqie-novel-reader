import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchBookDetailAndDirectory } from '../utils/api-helpers';
import { fetchBookDetail } from '../services/api';
import { normalizeBookInfo } from '../utils/bookInfo';
import { formatErrorMessage } from '../utils/errors';

function handleBookError(err, setError) {
  if (err.name === 'AbortError') return;
  console.error('獲取書籍資訊失敗：', err);
  setError(
    formatErrorMessage(err, '獲取書籍資訊失敗，請檢查 bookId 是否正確，或者稍後再試。')
  );
}

export function useBookLoader(bookId, { detailOnly = false } = {}) {
  const [error, setError] = useState(null);
  const [bookInfo, setBookInfo] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refetchAbortRef = useRef(null);

  const loadBook = useCallback((forceRefresh = false, signal) => {
    if (!bookId || detailOnly) return;

    if (forceRefresh) {
      setError(null);
      setBookInfo(null);
    }

    fetchBookDetailAndDirectory(bookId, { forceRefresh, signal })
      .then((merged) => {
        setBookInfo(normalizeBookInfo(merged, bookId));
      })
      .catch((err) => handleBookError(err, setError));
  }, [bookId, detailOnly]);

  useEffect(() => {
    if (!bookId || detailOnly) return;
    const controller = new AbortController();
    loadBook(false, controller.signal);
    return () => controller.abort();
  }, [bookId, detailOnly, loadBook]);

  const refetch = useCallback(() => {
    if (!bookId || !detailOnly) return;
    refetchAbortRef.current?.abort();
    const controller = new AbortController();
    refetchAbortRef.current = controller;
    setIsRefreshing(true);
    setError(null);
    fetchBookDetailAndDirectory(bookId, { forceRefresh: true, signal: controller.signal })
      .then((merged) => {
        setBookInfo(normalizeBookInfo(merged, bookId));
        if (refetchAbortRef.current === controller) refetchAbortRef.current = null;
        setIsRefreshing(false);
      })
      .catch((err) => {
        handleBookError(err, setError);
        if (err.name !== 'AbortError') {
          if (refetchAbortRef.current === controller) refetchAbortRef.current = null;
          setIsRefreshing(false);
        }
      });
  }, [bookId, detailOnly]);

  useEffect(() => {
    return () => refetchAbortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!detailOnly || !bookId) return;
    setError(null);
    const controller = new AbortController();
    fetchBookDetail(bookId, { signal: controller.signal })
      .then((detail) => {
        const merged = { book_info: detail, item_data_list: [] };
        setBookInfo(normalizeBookInfo(merged, bookId));
      })
      .catch((err) => handleBookError(err, setError));
    return () => controller.abort();
  }, [detailOnly, bookId]);

  return { error, bookInfo, loadBook, refetch, isRefreshing };
}
