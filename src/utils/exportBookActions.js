import { detailCache } from './cache';
import { fetchBookDetail } from '../services/api';
import { getCachedOrFetchDirectory } from './api-helpers';
import { exportBookToTxt } from './exportBookTxt';
import { exportBookToEpub } from './exportBookEpub';
import { EXPORT_NO_CACHED_CHAPTERS_MSG } from './exportBookCommon';
import { formatErrorMessage } from './errors';

async function resolveExportBookData(bookId, bookInfo) {
  if (bookInfo?.item_data_list?.length) {
    return { bookInfo, itemDataList: bookInfo.item_data_list };
  }

  const directory = await getCachedOrFetchDirectory(bookId);
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

async function runBookExport({
  bookId,
  bookInfo,
  showToast,
  sortOrder,
  conversionMode,
  displayVariant,
  exportFn,
  errorMessage,
}) {
  try {
    const resolved = await resolveExportBookData(bookId, bookInfo);
    const result = await exportFn({
      bookId,
      bookInfo: resolved.bookInfo,
      itemDataList: resolved.itemDataList,
      sortOrder,
      conversionMode,
      displayVariant,
    });
    if (result?.exportedCount === 0) {
      showToast?.(EXPORT_NO_CACHED_CHAPTERS_MSG);
    }
    return result;
  } catch (err) {
    showToast?.(formatErrorMessage(err, errorMessage));
    return { exportedCount: 0 };
  }
}

/**
 * @param {Object} params
 * @param {string} params.bookId
 * @param {Object} [params.bookInfo]
 * @param {(message: string) => void} [params.showToast]
 * @param {'ascending'|'descending'} [params.sortOrder]
 * @param {string} [params.conversionMode]
 */
export function runBookTxtExport({
  bookId,
  bookInfo,
  showToast,
  sortOrder = 'ascending',
  conversionMode = 'tw',
  displayVariant = 'new',
}) {
  return runBookExport({
    bookId,
    bookInfo,
    showToast,
    sortOrder,
    conversionMode,
    displayVariant,
    exportFn: exportBookToTxt,
    errorMessage: '匯出 TXT 失敗，請稍後再試。',
  });
}

/**
 * @param {Object} params
 * @param {string} params.bookId
 * @param {Object} [params.bookInfo]
 * @param {(message: string) => void} [params.showToast]
 * @param {'ascending'|'descending'} [params.sortOrder]
 * @param {string} [params.conversionMode]
 * @param {'new'|'old'} [params.displayVariant]
 */
export function runBookEpubExport({
  bookId,
  bookInfo,
  showToast,
  sortOrder = 'ascending',
  conversionMode = 'tw',
  displayVariant = 'new',
}) {
  return runBookExport({
    bookId,
    bookInfo,
    showToast,
    sortOrder,
    conversionMode,
    displayVariant,
    exportFn: exportBookToEpub,
    errorMessage: '匯出 EPUB 失敗，請稍後再試。',
  });
}
