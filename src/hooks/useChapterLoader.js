import { useState, useCallback, useEffect, useRef } from 'react';
import { fetchItem } from '../services/api';
import { fetchBookDetailAndDirectory } from '../utils/api-helpers';
import { buildNovelDataFromDirectory } from '../utils/chapter-helpers';
import { setLastReadChapter } from '../utils/storage';
import { formatErrorMessage } from '../utils/errors';

export function useChapterLoader(itemId, bookId) {
  const [error, setError] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [bookInfo, setBookInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const userFetchAbortRef = useRef(null);

  const loadChapter = useCallback((forceRefresh = false, signal) => {
    if (!itemId) return;

    const effectiveSignal = signal ?? (() => {
      userFetchAbortRef.current?.abort();
      const controller = new AbortController();
      userFetchAbortRef.current = controller;
      return controller.signal;
    })();

    setLoading(true);
    setError(null);

    const loadPromise = bookId
      ? Promise.all([
          fetchItem(itemId, { forceRefresh, signal: effectiveSignal }),
          fetchBookDetailAndDirectory(bookId, { forceRefresh: false, signal: effectiveSignal }),
        ]).then(([contentRes, mergedBookInfo]) => {
          const contentData = contentRes.data.data;
          const novelData = buildNovelDataFromDirectory(itemId, bookId, mergedBookInfo.item_data_list);
          return {
            chapterData: { ...contentData, novel_data: novelData },
            bookInfo: mergedBookInfo,
          };
        })
      : fetchItem(itemId, { forceRefresh, signal: effectiveSignal }).then((response) => ({
          chapterData: response.data.data,
          bookInfo: null,
        }));

    loadPromise
      .then(({ chapterData: data, bookInfo: info }) => {
        setChapterData(data);
        setBookInfo(info);
        if (bookId && itemId) {
          setLastReadChapter(bookId, itemId);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('獲取章節內容失敗:', itemId, err);
        setError(
          formatErrorMessage(err, '獲取章節內容失敗，來到沒有內容的荒原，請返回目錄重試！')
        );
        setLoading(false);
      });
  }, [itemId, bookId]);

  useEffect(() => {
    return () => userFetchAbortRef.current?.abort();
  }, []);

  useEffect(() => {
    if (!itemId) return;
    const controller = new AbortController();
    loadChapter(false, controller.signal);
    return () => controller.abort();
  }, [itemId, loadChapter]);

  return {
    error,
    chapterData,
    bookInfo,
    loading,
    loadChapter,
  };
}
