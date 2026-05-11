import { chapterCache } from './cache';
import { maybeConvert } from './zh-convert';
import { getChapterTitle } from './chapter-helpers';
import { addBlankLine } from './text';

/**
 * Builds and downloads a book_id.txt file with book metadata and cached chapter content.
 * @param {Object} params
 * @param {string} params.bookId - Book ID
 * @param {Object} params.bookInfo - Book info (book_info.original_book_name, author, abstract)
 * @param {Array<{item_id: string, title: string}>} params.itemDataList - Chapter list
 * @param {'original'|'tw'|'hk'} [params.conversionMode] - Conversion mode: original, tw (Taiwan), hk (Hong Kong)
 * @returns {Promise<{ exportedCount: number }>} Number of chapters exported; 0 if none were cached
 */
export async function exportBookToTxt({ bookId, bookInfo, itemDataList, conversionMode = 'tw' }) {
  if (!bookId || !bookInfo || !itemDataList?.length) return { exportedCount: 0 };

  const bookInfoData = bookInfo?.book_info || bookInfo;
  const bookName = maybeConvert(bookInfoData.original_book_name, conversionMode);
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
  for (const item of itemDataList) {
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
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeName = (bookName || '').replace(/[<>:"/\\|?*]/g, '_').trim().slice(0, 200) || bookId;
  a.download = `${safeName}.txt`;
  a.click();
  URL.revokeObjectURL(url);
  return { exportedCount };
}
