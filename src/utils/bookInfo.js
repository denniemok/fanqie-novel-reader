import { cleanAbstract } from './text';

/**
 * Normalizes raw book info from API or cache into a consistent shape with fallbacks.
 * @param {Object} raw - Raw merged book info (from fetchBookDetailAndDirectory or fetchBookDetail)
 * @param {string} bookId - Book ID for fallbacks
 * @returns {Object} Normalized book info
 */
export function normalizeBookInfo(raw, bookId) {
  if (!raw) return null;

  const book_info = raw.book_info || {};
  const item_data_list = raw.item_data_list ?? [];

  const normalizedBookInfo = {
    ...book_info,
    book_name: book_info.book_name || `書籍 ${(bookId || '').slice(0, 8)}`,
    author: book_info.author || '未知作者',
    abstract: cleanAbstract(book_info.abstract) || null,
    audio_thumb_uri: book_info.audio_thumb_uri || null,
    score: (book_info.score === '0') ? null : (book_info.score || null),
    tags: book_info.tags || null,
    category: book_info.category || null,
    sub_info: book_info.sub_info || null,
    content_chapter_number: (book_info.content_chapter_number === '0') ? null : (book_info.content_chapter_number || null),
  };

  const n = item_data_list.length || normalizedBookInfo.content_chapter_number;
  return {
    ...raw,
    book_info: normalizedBookInfo,
    item_data_list,
    chapter_count: (n === 0 || n === '0' || n == null) ? null : n,
  };
}
