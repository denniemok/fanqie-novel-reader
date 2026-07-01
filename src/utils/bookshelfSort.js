export const BOOKSHELF_SORT_OPTIONS = [
  { value: 'manual', label: '手動' },
  { value: 'rating', label: '評分' },
  { value: 'update', label: '更新日期' },
  { value: 'chapters', label: '章節數' },
  { value: 'words', label: '字數' },
];

export const DISCOVER_SORT_OPTIONS = [
  { value: 'default', label: '預設' },
  { value: 'rating', label: '評分' },
  { value: 'update', label: '更新日期' },
  { value: 'words', label: '字數' },
];

const SORT_FIELD = {
  rating: 'score',
  update: 'updateTime',
  chapters: 'chapters',
  words: 'words',
};

/** @param {object|null} detail */
export function extractBookshelfSortMeta(detail) {
  const d = detail || {};
  const scoreRaw = d.score;
  const score = scoreRaw && scoreRaw !== '0' ? parseFloat(scoreRaw) : null;
  const updateTime = d.last_publish_time ? parseInt(d.last_publish_time, 10) : null;
  const words = d.word_number && d.word_number !== '0' ? parseInt(d.word_number, 10) : null;
  const chapters = d.content_chapter_number && d.content_chapter_number !== '0'
    ? parseInt(d.content_chapter_number, 10)
    : null;
  return {
    score: Number.isFinite(score) ? score : null,
    updateTime: Number.isFinite(updateTime) ? updateTime : null,
    words: Number.isFinite(words) ? words : null,
    chapters: Number.isFinite(chapters) ? chapters : null,
  };
}

/** @param {Array<{bookId: string}>} items */
export function sortBookshelfItems(items, sortBy, metaMap, direction = 'desc') {
  if (sortBy === 'manual' || !SORT_FIELD[sortBy]) return items;
  const field = SORT_FIELD[sortBy];
  const desc = direction !== 'asc';
  return [...items]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const va = metaMap[a.item.bookId]?.[field] ?? null;
      const vb = metaMap[b.item.bookId]?.[field] ?? null;
      if (va == null && vb == null) return a.index - b.index;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (va !== vb) return desc ? vb - va : va - vb;
      return a.index - b.index;
    })
    .map(({ item }) => item);
}

/** @param {Array<{book_id: string}>} books */
export function sortDiscoverBooks(books, sortBy, direction = 'desc') {
  if (!books.length || sortBy === 'default' || !SORT_FIELD[sortBy]) return books;
  const bookById = Object.fromEntries(books.map((book) => [book.book_id, book]));
  const metaMap = Object.fromEntries(
    books.map((book) => [book.book_id, extractBookshelfSortMeta(book)])
  );
  const sortedItems = sortBookshelfItems(
    books.map((book) => ({ bookId: book.book_id })),
    sortBy,
    metaMap,
    direction,
  );
  return sortedItems.map(({ bookId }) => bookById[bookId]);
}
