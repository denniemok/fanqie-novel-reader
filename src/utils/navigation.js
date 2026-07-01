export const ROUTES = {
  home: '/',
  bookshelf: '/bookshelf',
  discover: '/discover',
  announcements: '/announcements',
  download: '/download',
  status: '/status',
  catalog: '/catalog',
  chapter: '/chapter',
  comments: '/comments',
  export: '/export',
  import: '/import',
};

export const DISCOVER_SEARCH_QUERY_KEY = 'q';

const DISCOVER_SECTION_TABS = new Set(['rank', 'recommend']);

export function buildDiscoverUrl(tab, section, query) {
  const path = section && DISCOVER_SECTION_TABS.has(tab)
    ? `${ROUTES.discover}/${tab}/${section}`
    : `${ROUTES.discover}/${tab}`;
  const trimmedQuery = query?.trim();
  if (tab === 'search' && trimmedQuery) {
    const params = new URLSearchParams({ [DISCOVER_SEARCH_QUERY_KEY]: trimmedQuery });
    return `${path}?${params.toString()}`;
  }
  return path;
}

export function isDiscoverPath(pathname) {
  return pathname === ROUTES.discover || pathname.startsWith(`${ROUTES.discover}/`);
}

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
