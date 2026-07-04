import { useState, useEffect, useMemo } from 'react';
import { collectCategoriesFromItems, hasActiveBookFilters } from '../utils/book/bookFilters';

export function usePersistedBookFilters({ getState, setState, items, getMeta }) {
  const [bookFilters, setBookFilters] = useState(() => getState().filters);
  const [filtersExpanded, setFiltersExpanded] = useState(() => getState().expanded);

  useEffect(() => {
    setState({ filters: bookFilters, expanded: filtersExpanded });
  }, [bookFilters, filtersExpanded, setState]);

  const filterCategories = useMemo(
    () => collectCategoriesFromItems(items, getMeta),
    [items, getMeta]
  );

  const hasActiveFilters = hasActiveBookFilters(bookFilters);

  return {
    bookFilters,
    setBookFilters,
    filtersExpanded,
    setFiltersExpanded,
    filterCategories,
    hasActiveFilters,
  };
}
