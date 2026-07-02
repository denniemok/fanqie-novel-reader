import { useState, useEffect } from 'react';
import { fetchSearchBooks } from '../../services/api';
import { formatErrorMessage } from '../../utils/errors';
import { fetchDiscoverList } from '../../services/discover';
import {
  PRIMARY_TAB_OTHERS,
  PRIMARY_TAB_SEARCH,
  PRIMARY_ERROR_MESSAGES,
} from '../../components/discover/constants';

export function useDiscoverBookList({
  activePrimary,
  activeSecondary,
  submittedQuery,
  refreshKey,
  skip,
}) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (skip) return undefined;

    if (activePrimary === PRIMARY_TAB_OTHERS) {
      setLoading(false);
      setError(null);
      setBooks([]);
      return undefined;
    }

    if (activePrimary === PRIMARY_TAB_SEARCH) {
      if (!submittedQuery) {
        setLoading(false);
        setError(null);
        setBooks([]);
        return undefined;
      }

      const controller = new AbortController();
      setLoading(true);
      setError(null);
      setBooks([]);

      fetchSearchBooks(submittedQuery, { signal: controller.signal })
        .then((list) => {
          setBooks(list);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;
          console.error('搜尋書籍失敗:', submittedQuery, err);
          setError(formatErrorMessage(err, PRIMARY_ERROR_MESSAGES[PRIMARY_TAB_SEARCH]));
          setLoading(false);
        });

      return () => controller.abort();
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setBooks([]);

    fetchDiscoverList(activePrimary, activeSecondary, { signal: controller.signal })
      .then((list) => {
        setBooks(list);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('獲取書籍列表失敗:', activePrimary, activeSecondary, err);
        setError(formatErrorMessage(err, PRIMARY_ERROR_MESSAGES[activePrimary]));
        setLoading(false);
      });

    return () => controller.abort();
  }, [skip, activePrimary, activeSecondary, submittedQuery, refreshKey]);

  return { books, loading, error };
}
