import { formatTimestamp } from '../datetime';

/** @param {string} val - Word count string */
function formatWordNumber(val) {
  if (val === '0' || !val) return null;
  const n = parseInt(val, 10);
  return n >= 10000 ? `${(n / 10000).toFixed(1)}萬` : String(n);
}

function pickFirstNonEmpty(...values) {
  return values.find((value) => value != null && value !== '') ?? null;
}

/** Normalize chapter count from directory length or API metadata. */
export function resolveChapterCount(value) {
  return (value === 0 || value === '0' || value == null) ? null : value;
}

/** Resolve display title and cover from raw book fields for the chosen variant. */
export function resolveBookDisplay(bookInfo, variant = 'new', bookId = null) {
  const data = bookInfo?.book_info || bookInfo || {};
  const id = bookId || data.book_id || bookInfo?.book_id || null;
  const nameFallback = id ? `書籍 ${id.slice(0, 8)}` : null;

  if (variant === 'old') {
    return {
      book_name: pickFirstNonEmpty(data.original_book_name, data.book_name, nameFallback),
      thumb_url: pickFirstNonEmpty(data.audio_thumb_uri, data.thumb_url),
    };
  }

  return {
    book_name: pickFirstNonEmpty(data.book_name, data.original_book_name, nameFallback),
    thumb_url: pickFirstNonEmpty(data.thumb_url, data.audio_thumb_uri),
  };
}

function normalizeBookMetaFields(bookInfo, bookId) {
  return {
    book_name: bookInfo.book_name || null,
    original_book_name: bookInfo.original_book_name || null,
    author: bookInfo.author || '未知作者',
    abstract: bookInfo.abstract || null,
    thumb_url: bookInfo.thumb_url || null,
    audio_thumb_uri: bookInfo.audio_thumb_uri || null,
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

/** Book payload for ``BookInfo`` from a flat discover-list item. */
export function normalizeDiscoverBookPayload(book) {
  const book_info = normalizeDiscoverBookInfo(book);
  if (!book_info) return { book_info: null, chapter_count: null };
  return {
    book_info,
    chapter_count: resolveChapterCount(book_info.content_chapter_number),
  };
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
    chapter_count: resolveChapterCount(n),
  };
}

/** Normalize detail-only payloads (e.g. comments page) without a directory. */
export function normalizeDetailOnly(detail, bookId) {
  return normalizeBookInfo({ book_info: detail, item_data_list: [] }, bookId);
}
