export const CHAPTERS_PER_PAGE = 50;

/** Build chapter-number page ranges with up to `chaptersPerPage` chapters each. */
export function getPageRanges(totalChapters, chaptersPerPage = CHAPTERS_PER_PAGE) {
  if (totalChapters <= 0) return [{ start: 1, end: 1 }];

  const ranges = [];
  let start = 1;

  while (start <= totalChapters) {
    const end = Math.min(start + chaptersPerPage - 1, totalChapters);
    ranges.push({ start, end });
    start = end + 1;
  }

  return ranges;
}

export function getTotalPages(totalChapters, chaptersPerPage = CHAPTERS_PER_PAGE) {
  return Math.max(1, getPageRanges(totalChapters, chaptersPerPage).length);
}

export function getAscendingPageIndex(displayPage, sortOrder, totalPages) {
  if (sortOrder === 'descending') {
    return totalPages - 1 - displayPage;
  }
  return displayPage;
}

export function getPaginatedChapters(
  itemDataList,
  sortOrder,
  displayPage,
  chaptersPerPage = CHAPTERS_PER_PAGE,
) {
  const ascending = itemDataList || [];
  const pageRanges = getPageRanges(ascending.length, chaptersPerPage);
  const totalPages = pageRanges.length;
  const safePage = Math.min(Math.max(0, displayPage), totalPages - 1);
  const ascPageIndex = getAscendingPageIndex(safePage, sortOrder, totalPages);
  const { start, end } = pageRanges[ascPageIndex];
  const slice = ascending.slice(start - 1, end);
  return sortOrder === 'descending' ? [...slice].reverse() : slice;
}

export function getPageOptions(totalChapters, sortOrder, chaptersPerPage = CHAPTERS_PER_PAGE) {
  const pageRanges = getPageRanges(totalChapters, chaptersPerPage);
  const totalPages = pageRanges.length;
  return Array.from({ length: totalPages }, (_, displayPage) => {
    const ascPageIndex = getAscendingPageIndex(displayPage, sortOrder, totalPages);
    const range = pageRanges[ascPageIndex];
    const pageNumber = displayPage + 1;
    return {
      value: String(displayPage),
      pageNumber,
      rangeStart: range.start,
      rangeEnd: range.end,
    };
  });
}
