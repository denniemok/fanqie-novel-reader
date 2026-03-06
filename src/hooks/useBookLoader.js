import { useState, useCallback, useEffect } from 'react';
import { fetchBookWithDetail } from '../utils/api-helpers';
import { formatErrorMessage } from '../utils/errors';

export function useBookLoader(bookId) {
  const [error, setError] = useState(null);
  const [bookInfo, setBookInfo] = useState(null);

  const loadBook = useCallback((forceRefresh = false) => {
    if (!bookId) return;
    
    if (forceRefresh) {
      setError(null);
      setBookInfo(null);
    }

    fetchBookWithDetail(bookId, { forceRefresh })
      .then((merged) => {
        setBookInfo(merged);
      })
      .catch((err) => {
        console.error('獲取圖書資訊失敗：', err);
        const msg = formatErrorMessage(
          err,
          '獲取圖書資訊失敗，請檢查<span>bookId</span>是否正確，或者稍後再試。'
        );
        setError(msg);
      });
  }, [bookId]);

  useEffect(() => {
    if (bookId) loadBook(false);
  }, [bookId, loadBook]);

  return { error, bookInfo, loadBook };
}
