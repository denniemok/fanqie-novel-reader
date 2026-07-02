import { useState, useCallback } from 'react';
import { fetchBookDetailAndDirectory } from '../../utils/api-helpers';
import { formatErrorMessage } from '../../utils/errors';

async function refreshSingleBook(bookId) {
  const { partialLoadMessage } = await fetchBookDetailAndDirectory(bookId, { forceRefresh: true });
  return {
    bookId,
    ok: !partialLoadMessage,
    partialLoadMessage,
    error: null,
  };
}

/** Manages per-book refresh state for bookshelf and similar multi-book views. */
export function useBookRefresh() {
  const [refreshingBookIds, setRefreshingBookIds] = useState(() => new Set());
  const [bookDataVersions, setBookDataVersions] = useState({});
  const [bookRefreshErrors, setBookRefreshErrors] = useState({});

  const clearBookRefreshErrors = useCallback((bookIds) => {
    setBookRefreshErrors((prev) => {
      const ids = (Array.isArray(bookIds) ? bookIds : [bookIds]).map(String);
      if (ids.length === 0) return prev;
      const next = { ...prev };
      ids.forEach((bookId) => delete next[bookId]);
      return next;
    });
  }, []);

  const bumpBookDataVersion = useCallback((bookId) => {
    setBookDataVersions((prev) => ({
      ...prev,
      [bookId]: (prev[bookId] || 0) + 1,
    }));
  }, []);

  const applyRefreshOutcome = useCallback((bookId, partialLoadMessage, errorMessage) => {
    if (partialLoadMessage || !errorMessage) {
      bumpBookDataVersion(bookId);
    }
    if (partialLoadMessage) {
      setBookRefreshErrors((prev) => ({ ...prev, [bookId]: partialLoadMessage }));
    } else if (errorMessage) {
      setBookRefreshErrors((prev) => ({ ...prev, [bookId]: errorMessage }));
    }
  }, [bumpBookDataVersion]);

  const handleBookRefresh = useCallback(async (_e, bookId) => {
    if (refreshingBookIds.has(bookId)) return;

    setRefreshingBookIds((prev) => new Set(prev).add(bookId));
    setBookRefreshErrors((prev) => {
      const next = { ...prev };
      delete next[bookId];
      return next;
    });

    try {
      const outcome = await refreshSingleBook(bookId);
      applyRefreshOutcome(bookId, outcome.partialLoadMessage, null);
    } catch (err) {
      applyRefreshOutcome(
        bookId,
        null,
        formatErrorMessage(err, '刷新失敗，請稍後再試。'),
      );
    } finally {
      setRefreshingBookIds((prev) => {
        const next = new Set(prev);
        next.delete(bookId);
        return next;
      });
    }
  }, [refreshingBookIds, applyRefreshOutcome]);

  const handleBulkRefresh = useCallback(async (bookIds, showToast) => {
    if (bookIds.length === 0 || refreshingBookIds.size > 0) return;

    setRefreshingBookIds(new Set(bookIds));
    setBookRefreshErrors((prev) => {
      const next = { ...prev };
      bookIds.forEach((bookId) => delete next[bookId]);
      return next;
    });

    const outcomes = await Promise.all(
      bookIds.map(async (bookId) => {
        try {
          const outcome = await refreshSingleBook(bookId);
          applyRefreshOutcome(bookId, outcome.partialLoadMessage, null);
          return outcome;
        } catch (err) {
          applyRefreshOutcome(
            bookId,
            null,
            formatErrorMessage(err, '刷新失敗，請稍後再試。'),
          );
          return { bookId, ok: false, partialLoadMessage: null, error: err };
        } finally {
          setRefreshingBookIds((prev) => {
            const next = new Set(prev);
            next.delete(bookId);
            return next;
          });
        }
      }),
    );

    const succeeded = outcomes.filter((o) => o.ok).length;
    const failed = outcomes.length - succeeded;

    if (failed === 0) {
      showToast(`已刷新 ${bookIds.length} 本書籍`);
    } else if (succeeded === 0) {
      showToast(`全部 ${failed} 本刷新失敗`);
    } else {
      showToast(`${succeeded} 本刷新成功，${failed} 本失敗`);
    }
  }, [refreshingBookIds, applyRefreshOutcome]);

  const resetRefreshingOnSettingsExit = useCallback(() => {
    setRefreshingBookIds(new Set());
  }, []);

  return {
    refreshingBookIds,
    bookDataVersions,
    bookRefreshErrors,
    clearBookRefreshErrors,
    handleBookRefresh,
    handleBulkRefresh,
    resetRefreshingOnSettingsExit,
  };
}
