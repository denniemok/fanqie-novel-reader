import { cleanAbstract } from './text';

/** @param {string} ts - 10-digit Unix timestamp string */
function formatTimestamp(ts) {
  if (!ts) return null;
  const d = new Date(parseInt(ts, 10) * 1000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}`;
}

/** @param {string} val - Word count string */
function formatWordNumber(val) {
  if (val === '0' || !val) return null;
  const n = parseInt(val, 10);
  return n >= 10000 ? `${(n / 10000).toFixed(1)}萬` : String(n);
}

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
    original_book_name: book_info.original_book_name || `書籍 ${(bookId || '').slice(0, 8)}`,
    author: book_info.author || '未知作者',
    abstract: cleanAbstract(book_info.abstract) || null,
    thumb_url: book_info.thumb_url || null,
    score: (book_info.score === '0') ? null : (book_info.score || null),
    tags: book_info.tags || null,
    category: book_info.category || null,
    sub_info: book_info.sub_info || null,
    content_chapter_number: (book_info.content_chapter_number === '0') ? null : (book_info.content_chapter_number || null),
    word_number: formatWordNumber(book_info.word_number),
    last_publish_time: formatTimestamp(book_info.last_publish_time),
    creation_status: (book_info.creation_status === '0') ? '已完結' : (book_info.creation_status ? '連載中' : null),
  };

  const n = item_data_list.length || normalizedBookInfo.content_chapter_number;
  return {
    ...raw,
    book_info: normalizedBookInfo,
    item_data_list,
    chapter_count: (n === 0 || n === '0' || n == null) ? null : n,
  };
}
