import { fetchBookDirectory, fetchBookDetail } from '../services/api';
import { directoryCache, detailCache } from './cache';

export async function getCachedOrFetchDirectory(bookId) {
  let directory = await directoryCache.get(bookId);
  if (!directory?.item_data_list?.length) {
    directory = await fetchBookDirectory(bookId);
  }
  return directory;
}

async function resolveSettledWithCache(settled, cache, bookId, label, emptyFallback) {
  if (settled.status === 'fulfilled') {
    return { value: settled.value, hadCache: false };
  }
  console.error(`${label}:`, bookId, settled.reason);
  const cached = await cache.get(bookId);
  return { value: cached ?? emptyFallback, hadCache: cached != null };
}

export async function fetchBookDetailAndDirectory(bookId, { forceRefresh = false, catalogOnly = false, signal } = {}) {
  const refreshDirectory = forceRefresh;
  const refreshDetail = forceRefresh && !catalogOnly;
  const [dirSettled, detailSettled] = await Promise.allSettled([
    fetchBookDirectory(bookId, { forceRefresh: refreshDirectory, signal }),
    fetchBookDetail(bookId, { forceRefresh: refreshDetail, signal }),
  ]);

  const { value: bookData, hadCache: hadDirectoryCache } = await resolveSettledWithCache(
    dirSettled,
    directoryCache,
    bookId,
    '獲取書籍目錄失敗',
    { item_data_list: [] },
  );

  const { value: detail, hadCache: hadDetailCache } = await resolveSettledWithCache(
    detailSettled,
    detailCache,
    bookId,
    '獲取書籍詳情失敗',
    {},
  );

  if (
    dirSettled.status === 'rejected' &&
    detailSettled.status === 'rejected' &&
    !hadDirectoryCache &&
    !hadDetailCache
  ) {
    throw dirSettled.reason ?? detailSettled.reason;
  }

  if (
    dirSettled.status === 'rejected' &&
    !hadDirectoryCache &&
    !(bookData.item_data_list?.length)
  ) {
    throw dirSettled.reason ?? new Error('獲取書籍目錄失敗，請檢查 bookId 是否正確，或者稍後再試。');
  }

  const merged = {
    ...bookData,
    book_info: { ...detail },
  };

  let partialLoadMessage = null;
  if (!signal?.aborted) {
    const dirFail = dirSettled.status === 'rejected' && dirSettled.reason?.name !== 'AbortError';
    const detailFail = detailSettled.status === 'rejected' && detailSettled.reason?.name !== 'AbortError';

    if (dirFail && detailFail) {
      partialLoadMessage = '目錄與書籍詳情均無法更新，已顯示快取內容';
    } else if (dirFail) {
      partialLoadMessage = hadDirectoryCache ? '目錄無法更新，已顯示快取章節' : '目錄載入失敗';
    } else if (detailFail) {
      partialLoadMessage = hadDetailCache ? '書籍詳情無法更新，已顯示快取資訊' : '書籍詳情載入失敗';
    }
  }

  return { merged, partialLoadMessage };
}
