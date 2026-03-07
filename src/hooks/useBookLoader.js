import { useState, useCallback, useEffect } from 'react';
import { fetchBookDetailAndDirectory } from '../utils/api-helpers';
import { fetchBookDetail } from '../api';
import { normalizeBookInfo } from '../utils/bookInfo';
import { formatErrorMessage } from '../utils/errors';

export function useBookLoader(bookId, { detailOnly = false } = {}) {
  const [error, setError] = useState(null);
  const [bookInfo, setBookInfo] = useState(null);

  const loadBook = useCallback((forceRefresh = false) => {
    if (!bookId || detailOnly) return;

    if (forceRefresh) {
      setError(null);
      setBookInfo(null);
    }

    fetchBookDetailAndDirectory(bookId, { forceRefresh })
      .then((merged) => {
        setBookInfo(normalizeBookInfo(merged, bookId));
      })
      .catch((err) => {
        console.error('獲取圖書資訊失敗：', err);
        const msg = formatErrorMessage(
          err,
          '獲取圖書資訊失敗，請檢查<span>bookId</span>是否正確，或者稍後再試。'
        );
        setError(msg);
      });
  }, [bookId, detailOnly]);

  useEffect(() => {
    if (bookId && !detailOnly) loadBook(false);
  }, [bookId, detailOnly, loadBook]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refetch = useCallback(() => {
    if (!bookId || !detailOnly) return;
    setIsRefreshing(true);
    fetchBookDetailAndDirectory(bookId, { forceRefresh: true })
      .then((merged) => {
        setBookInfo(normalizeBookInfo(merged, bookId));
      })
      .catch(() => {})
      .finally(() => {
        setIsRefreshing(false);
      });
  }, [bookId, detailOnly]);

  useEffect(() => {
    if (detailOnly && bookId) {
      fetchBookDetail(bookId)
        .then((detail) => {
          const merged = { book_info: detail, item_data_list: [] };
          setBookInfo(normalizeBookInfo(merged, bookId));
        })
        .catch(() => {});
    }
  }, [detailOnly, bookId]);

  return { error, bookInfo, loadBook, refetch, isRefreshing };
}
