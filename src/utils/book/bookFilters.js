export const EMPTY_BOOK_FILTERS = {
  category: '',
  status: '',
  wordCount: '',
};

export const STATUS_FILTER_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'completed', label: '已完結' },
  { value: 'ongoing', label: '連載中' },
];

export const WORD_COUNT_FILTER_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'under30', label: '30萬以下' },
  { value: '30to50', label: '30-50萬' },
  { value: '50to100', label: '50-100萬' },
  { value: '100to200', label: '100-200萬' },
  { value: 'over200', label: '200萬以上' },
];

const WORD_COUNT_RANGES = {
  under30: { max: 300_000 },
  '30to50': { min: 300_000, max: 500_000 },
  '50to100': { min: 500_000, max: 1_000_000 },
  '100to200': { min: 1_000_000, max: 2_000_000 },
  over200: { min: 2_000_000 },
};

export function hasActiveBookFilters(filters = EMPTY_BOOK_FILTERS) {
  return Boolean(filters.category || filters.status || filters.wordCount);
}

const STATUS_FILTER_VALUES = new Set(STATUS_FILTER_OPTIONS.map((option) => option.value));
const WORD_COUNT_FILTER_VALUES = new Set(WORD_COUNT_FILTER_OPTIONS.map((option) => option.value));

export function normalizeBookFilters(raw) {
  if (!raw || typeof raw !== 'object') return { ...EMPTY_BOOK_FILTERS };
  return {
    category: typeof raw.category === 'string' ? raw.category : '',
    status: STATUS_FILTER_VALUES.has(raw.status) ? raw.status : '',
    wordCount: WORD_COUNT_FILTER_VALUES.has(raw.wordCount) ? raw.wordCount : '',
  };
}

export function normalizeBookFilterState(raw) {
  if (!raw || typeof raw !== 'object') {
    return { filters: { ...EMPTY_BOOK_FILTERS }, expanded: false };
  }
  return {
    filters: normalizeBookFilters(raw.filters ?? raw),
    expanded: Boolean(raw.expanded),
  };
}

function parseWordCount(raw) {
  if (raw === '0' || raw == null || raw === '') return null;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : null;
}

/** @param {object|null|undefined} detail */
export function extractBookFilterMeta(detail) {
  const d = detail || {};
  return {
    category: d.category || '',
    creationStatus: d.creation_status ?? '',
    wordCount: parseWordCount(d.word_number),
  };
}

/** @param {object} book */
export function extractDiscoverBookFilterMeta(book) {
  return extractBookFilterMeta(book?.book_info || book);
}

/** @param {Array} items */
export function collectCategoriesFromItems(items, getMeta) {
  const categories = new Set();
  items.forEach((item) => {
    const category = getMeta(item)?.category;
    if (category) categories.add(category);
  });
  return [...categories].sort((a, b) => a.localeCompare(b, 'zh-Hant'));
}

function matchesWordCountFilter(wordCount, filterKey) {
  if (!filterKey) return true;
  if (wordCount == null) return false;
  const range = WORD_COUNT_RANGES[filterKey];
  if (!range) return true;
  if (range.min != null && wordCount < range.min) return false;
  if (range.max != null && wordCount >= range.max) return false;
  return true;
}

function matchesStatusFilter(creationStatus, filterKey) {
  if (!filterKey) return true;
  if (filterKey === 'completed') return creationStatus === '0';
  if (filterKey === 'ongoing') return Boolean(creationStatus) && creationStatus !== '0';
  return true;
}

function matchesCategoryFilter(category, filterKey) {
  if (!filterKey) return true;
  return category === filterKey;
}

/** @param {object|null|undefined} meta */
export function bookMatchesFilters(meta, filters = EMPTY_BOOK_FILTERS) {
  if (!hasActiveBookFilters(filters)) return true;
  if (!meta) return true;

  return (
    matchesCategoryFilter(meta.category, filters.category)
    && matchesStatusFilter(meta.creationStatus, filters.status)
    && matchesWordCountFilter(meta.wordCount, filters.wordCount)
  );
}

/** @param {Array} items @param {Function} getMeta @param {object} filters @param {Array} options @param {string} filterKey */
export function computeBookFilterOptionCounts(items, getMeta, filters, options, filterKey) {
  const counts = {};
  for (const option of options) {
    const testFilters = { ...filters, [filterKey]: option.value };
    let count = 0;
    for (const item of items) {
      if (bookMatchesFilters(getMeta(item), testFilters)) count += 1;
    }
    counts[option.value || ''] = count;
  }
  return counts;
}
