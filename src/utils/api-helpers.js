import { fetchBookDirectory, fetchBookDetail } from '../services/api';
import { directoryCache, detailCache } from './cache';

export async function fetchBookDetailAndDirectory(bookId, { forceRefresh = false, catalogOnly = false, signal } = {}) {
  const refreshDirectory = forceRefresh;
  const refreshDetail = forceRefresh && !catalogOnly;
  const [dirSettled, detailSettled] = await Promise.allSettled([
    fetchBookDirectory(bookId, { forceRefresh: refreshDirectory, signal }),
    fetchBookDetail(bookId, { forceRefresh: refreshDetail, signal }),
  ]);

  let bookData;
  let hadDirectoryCache = false;
  if (dirSettled.status === 'fulfilled') {
    bookData = dirSettled.value.data.data.data;
  } else {
    console.error('獲取書籍目錄失敗:', bookId, dirSettled.reason);
    const cached = await directoryCache.get(bookId);
    hadDirectoryCache = cached != null;
    bookData = cached ?? { book_info: {}, item_data_list: [] };
  }

  let detail = {};
  let hadDetailCache = false;
  if (detailSettled.status === 'fulfilled') {
    detail = detailSettled.value;
  } else {
    console.error('獲取書籍詳情失敗:', bookId, detailSettled.reason);
    const cached = await detailCache.get(bookId);
    hadDetailCache = cached != null;
    detail = cached ?? {};
  }

  if (
    dirSettled.status === 'rejected' &&
    detailSettled.status === 'rejected' &&
    !hadDirectoryCache &&
    !hadDetailCache
  ) {
    throw dirSettled.reason ?? detailSettled.reason;
  }

  const merged = {
    ...bookData,
    book_info: { ...bookData.book_info, ...detail },
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
