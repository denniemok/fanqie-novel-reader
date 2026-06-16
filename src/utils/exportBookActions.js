import { detailCache, directoryCache } from './cache';
import { fetchBookDetail, fetchBookDirectory } from '../services/api';
import { exportBookToTxt, EXPORT_NO_CACHED_CHAPTERS_MSG } from './exportBookTxt';
import { formatErrorMessage } from './errors';

async function resolveExportBookData(bookId, bookInfo) {
  if (bookInfo?.item_data_list?.length) {
    return { bookInfo, itemDataList: bookInfo.item_data_list };
  }

  let directory = await directoryCache.get(bookId);
  if (!directory?.item_data_list?.length) {
    directory = await fetchBookDirectory(bookId);
  }
  let detail = await detailCache.get(bookId);
  if (!detail) {
    detail = await fetchBookDetail(bookId);
  }
  const itemDataList = directory?.item_data_list ?? [];
  if (!itemDataList.length) {
    throw new Error('無法取得章節目錄');
  }
  return { bookInfo: { book_info: detail }, itemDataList };
}

/**
 * Resolves book/directory data when needed, exports cached chapters, and shows standard toasts.
 * @param {Object} params
 * @param {string} params.bookId
 * @param {Object} [params.bookInfo] - Optional; skips cache/API lookup when item_data_list is present
 * @param {(message: string) => void} [params.showToast]
 */
export async function runBookTxtExport({ bookId, bookInfo, showToast }) {
  try {
    const resolved = await resolveExportBookData(bookId, bookInfo);
    const result = await exportBookToTxt({
      bookId,
      bookInfo: resolved.bookInfo,
      itemDataList: resolved.itemDataList,
    });
    if (result?.exportedCount === 0) {
      showToast?.(EXPORT_NO_CACHED_CHAPTERS_MSG);
    }
    return result;
  } catch (err) {
    showToast?.(formatErrorMessage(err, '匯出失敗，請稍後再試。'));
    return { exportedCount: 0 };
  }
}
