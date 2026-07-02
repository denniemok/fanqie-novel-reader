import { triggerFileDownload } from './downloadFile';
import {
  collectCachedChaptersForExport,
  resolveExportBookMetadata,
  sanitizeExportFileName,
} from './exportBookCommon';

/**
 * Builds and downloads a book .txt file with book metadata and cached chapter content.
 *
 * @param {Object} params
 * @param {string} params.bookId
 * @param {Object} params.bookInfo
 * @param {Array<{item_id: string, title: string}>} params.itemDataList
 * @param {'ascending'|'descending'} [params.sortOrder]
 * @param {string} [params.conversionMode]
 * @returns {Promise<{ exportedCount: number }>}
 */
export async function exportBookToTxt({
  bookId,
  bookInfo,
  itemDataList,
  sortOrder = 'ascending',
  conversionMode = 'tw',
  displayVariant = 'new',
}) {
  if (!bookId || !bookInfo || !itemDataList?.length) return { exportedCount: 0 };

  const { bookName, author, abstract } = resolveExportBookMetadata({
    bookId,
    bookInfo,
    conversionMode,
    displayVariant,
  });

  const chapters = await collectCachedChaptersForExport({
    itemDataList,
    sortOrder,
    conversionMode,
  });

  if (chapters.length === 0) return { exportedCount: 0 };

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

  for (const chapter of chapters) {
    lines.push(chapter.title);
    lines.push('');
    lines.push(chapter.content);
    lines.push('');
    lines.push('═══════════════════════════════════════');
    lines.push('');
  }

  const text = lines.join('\n');
  const safeName = sanitizeExportFileName(bookName, bookId);
  triggerFileDownload(text, `${safeName}.txt`, 'text/plain;charset=utf-8');
  return { exportedCount: chapters.length };
}
