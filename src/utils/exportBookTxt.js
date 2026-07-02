import { chapterCache } from './cache';
import { triggerFileDownload } from './downloadFile';
import { maybeConvert } from './zh-convert';
import { getChapterTitle } from './chapter-helpers';
import { addBlankLine } from './text';
import { sortChaptersByNumber } from './sorting';
import { getConversionMode, getBookDisplayVariant } from './storage';
import { resolveBookDisplay } from './bookInfo';

/** Shown when export runs but no chapters are cached locally. */
export const EXPORT_NO_CACHED_CHAPTERS_MSG = '沒有已下載的章節，請先下載後再匯出。';

/**
 * Builds and downloads a book .txt file with book metadata and cached chapter content.
 * Chapters are always exported in ascending order. Text conversion uses the stored
 * language preference (see getConversionMode) at export time.
 *
 * @param {Object} params
 * @param {string} params.bookId - Book ID
 * @param {Object} params.bookInfo - Book info (book_info.book_name, author, abstract)
 * @param {Array<{item_id: string, title: string}>} params.itemDataList - Chapter list
 * @returns {Promise<{ exportedCount: number }>} Number of chapters exported; 0 if none were cached
 */
export async function exportBookToTxt({ bookId, bookInfo, itemDataList }) {
  if (!bookId || !bookInfo || !itemDataList?.length) return { exportedCount: 0 };

  const conversionMode = getConversionMode();
  const displayVariant = getBookDisplayVariant();

  const bookInfoData = bookInfo?.book_info || bookInfo;
  const { book_name: bookNameRaw } = resolveBookDisplay(bookInfoData, displayVariant, bookId);
  const bookName = maybeConvert(bookNameRaw, conversionMode);
  const author = maybeConvert(bookInfoData.author, conversionMode);
  const abstract = maybeConvert(bookInfoData.abstract, conversionMode);

  const lines = [
    bookName,
    '',
    `${author}`,
    '',
    abstract || '（無簡介）',
    '',
    '═══════════════════════════════════════',
    '',
  ];

  let exportedCount = 0;
  const sortedList = sortChaptersByNumber(itemDataList, 'ascending');
  for (const item of sortedList) {
    const content = await chapterCache.get(item.item_id);
    if (content == null || typeof content !== 'string') continue;

    const plain = addBlankLine(content);
    const converted = maybeConvert(plain, conversionMode);
    const chapterTitle = maybeConvert(getChapterTitle(item), conversionMode);

    lines.push(chapterTitle);
    lines.push('');
    lines.push(converted.trim());
    lines.push('');
    lines.push('═══════════════════════════════════════');
    lines.push('');
    exportedCount += 1;
  }

  if (exportedCount === 0) return { exportedCount: 0 };

  const text = lines.join('\n');
  const safeName = (bookName || '').replace(/[<>:"/\\|?*]/g, '_').trim().slice(0, 200) || bookId;
  triggerFileDownload(text, `${safeName}.txt`, 'text/plain;charset=utf-8');
  return { exportedCount };
}
