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

function normalizeBookMetaFields(bookInfo, bookId) {
  return {
    book_name: bookInfo.book_name || bookInfo.original_book_name || `書籍 ${(bookId || '').slice(0, 8)}`,
    author: bookInfo.author || '未知作者',
    abstract: bookInfo.abstract || null,
    thumb_url: bookInfo.thumb_url || bookInfo.audio_thumb_uri || null,
    category: bookInfo.category || null,
    score: (bookInfo.score === '0') ? null : (bookInfo.score || null),
    tags: bookInfo.tags || null,
    sub_info: bookInfo.sub_info || null,
    word_number: formatWordNumber(bookInfo.word_number),
    last_publish_time: formatTimestamp(bookInfo.last_publish_time),
    creation_status: (bookInfo.creation_status === '0') ? '已完結' : (bookInfo.creation_status ? '連載中' : null),
    content_chapter_number: (bookInfo.content_chapter_number === '0') ? null : (bookInfo.content_chapter_number || null),
  };
}

/** Normalize a flat discover-list book into ``book_info`` fields for display. */
export function normalizeDiscoverBookInfo(book) {
  if (!book) return null;
  const raw = book.book_info || book;
  const bookId = raw.book_id || book.book_id || null;
  return normalizeBookMetaFields(raw, bookId);
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
    ...normalizeBookMetaFields(book_info, bookId),
  };

  const n = item_data_list.length || normalizedBookInfo.content_chapter_number;
  return {
    ...raw,
    book_info: normalizedBookInfo,
    item_data_list,
    chapter_count: (n === 0 || n === '0' || n == null) ? null : n,
  };
}

/** Normalize detail-only payloads (e.g. comments page) without a directory. */
export function normalizeDetailOnly(detail, bookId) {
  return normalizeBookInfo({ book_info: detail, item_data_list: [] }, bookId);
}
