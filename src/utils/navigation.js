export const ROUTES = {
  home: '/',
  bookshelf: '/bookshelf',
  newBook: '/new-book',
  announcements: '/announcements',
  download: '/download',
};

export function buildChapterUrl(itemId, bookId = null) {
  const params = new URLSearchParams({ itemId });
  if (bookId) {
    params.append('bookId', bookId);
  }
  return `/chapter?${params.toString()}`;
}

export function buildCatalogUrl(bookId, page = 1) {
  const params = new URLSearchParams({ bookId });
  if (page > 1) params.set('page', String(page));
  return `/catalog?${params.toString()}`;
}

export function buildCommentsUrl(bookId, page = 1) {
  const params = new URLSearchParams({ bookId });
  if (page > 1) params.set('page', String(page));
  return `/comments?${params.toString()}`;
}
