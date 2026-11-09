import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useParams, useSearchParams, Navigate } from 'react-router-dom';
import { buildCatalogUrl, buildDiscoverUrl } from '../../utils/navigation';
import { sortDiscoverBooks } from '../../utils/book/bookListSort';
import CollectionModal from '../collection/CollectionModal';
import { useToast } from '../../contexts/ToastContext';
import {
  getDiscoverViewMode,
  setDiscoverViewMode,
  getDiscoverSort,
  setDiscoverSort,
  getDiscoverSortDirection,
  setDiscoverSortDirection,
  getDiscoverFilterState,
  setDiscoverFilterState,
  setDiscoverActiveTab,
  removeBooksFromReadingHistory,
  addBooksToReadingHistory,
} from '../../utils/storage';
import { SEARCH_RESULT_LIMIT } from '../../utils/constants';
import { useDiscoverBookList } from '../../hooks/discover/useDiscoverBookList';
import { usePersistedBookFilters } from '../../hooks/usePersistedBookFilters';
import { usePersistedListPrefs } from '../../hooks/usePersistedListPrefs';
import { useCollectionsWithHistory } from '../../hooks/useCollectionsWithHistory';
import { useCollectionModalActions } from '../../hooks/useCollectionModalActions';
import {
  DEFAULT_SECONDARY_BY_PRIMARY,
  PRIMARY_TAB_OTHERS,
  PRIMARY_TAB_SEARCH,
  resolveDiscoverRoute,
  SECONDARY_TABS_BY_PRIMARY,
} from './constants';
import {
  bookMatchesFilters,
  extractDiscoverBookFilterMeta,
} from '../../utils/book/bookFilters';
import DiscoverSection from './DiscoverSection';
import EmptyHint from '../ui/EmptyHint';
import DiscoverHelp from './DiscoverHelp';
import DiscoverBookIdForm from './DiscoverBookIdForm';
import DiscoverToolbar from './DiscoverToolbar';
import DiscoverBookList from './DiscoverBookList';
import DiscoverBookSkeletons from './DiscoverBookSkeletons';
import { OthersPanel, SearchResultCapHint } from './styles';

function DiscoverBooks({ conversionMode = 'tw' }) {
  const navigate = useNavigate();
  const { notifyError } = useToast();
  const { tab, section } = useParams();
  const [searchParams] = useSearchParams();
  const {
    activePrimary,
    activeSecondary,
    secondaryTabs,
    redirectTab,
    redirectSection,
  } = resolveDiscoverRoute(tab, section);
  const submittedQuery = searchParams.get('q')?.trim() ?? '';
  const redirectTo = redirectTab ? buildDiscoverUrl(redirectTab, redirectSection) : null;
  const stripSearchQuery = activePrimary !== PRIMARY_TAB_SEARCH && submittedQuery;
  const searchRedirectTo = stripSearchQuery
    ? buildDiscoverUrl(activePrimary, activeSecondary)
    : null;

  const [refreshKey, setRefreshKey] = useState(0);
  const [searchInput, setSearchInput] = useState(submittedQuery);

  const { collections, allBookIds, reload: reloadCollectionData } = useCollectionsWithHistory();

  const {
    viewMode,
    sortBy,
    sortDirection,
    handleViewModeChange,
    handleSortChange,
    handleSortDirectionToggle,
  } = usePersistedListPrefs({
    getViewMode: getDiscoverViewMode,
    setViewMode: setDiscoverViewMode,
    getSort: getDiscoverSort,
    setSort: setDiscoverSort,
    getSortDirection: getDiscoverSortDirection,
    setSortDirection: setDiscoverSortDirection,
  });

  const {
    addToCollectionBookIds,
    newCollectionName,
    setNewCollectionName,
    openAddToCollection,
    closeAddToCollection,
    handleToggleBooksInCollection,
    handleCreateCollectionFromModal,
  } = useCollectionModalActions({
    collections,
    onReload: reloadCollectionData,
    notifyError,
    addToReadingHistoryOnInclude: true,
    addToHistoryOnOpenIfInCollection: true,
  });

  const skipFetch = Boolean(redirectTo || searchRedirectTo);
  const { books, loading, error } = useDiscoverBookList({
    activePrimary,
    activeSecondary,
    submittedQuery,
    refreshKey,
    skip: skipFetch,
  });

  const {
    bookFilters,
    setBookFilters,
    filtersExpanded,
    setFiltersExpanded,
    filterCategories,
    hasActiveFilters,
  } = usePersistedBookFilters({
    getState: getDiscoverFilterState,
    setState: setDiscoverFilterState,
    items: books,
    getMeta: extractDiscoverBookFilterMeta,
  });

  useEffect(() => {
    setSearchInput(submittedQuery);
  }, [submittedQuery]);

  useEffect(() => {
    if (redirectTo || searchRedirectTo) return;
    if (activePrimary === PRIMARY_TAB_OTHERS) return;
    setDiscoverActiveTab({ primary: activePrimary, secondary: activeSecondary });
  }, [activePrimary, activeSecondary, redirectTo, searchRedirectTo]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePrimary, activeSecondary, submittedQuery]);

  const filteredBooks = useMemo(() => {
    if (!hasActiveFilters) return books;
    return books.filter((book) => bookMatchesFilters(extractDiscoverBookFilterMeta(book), bookFilters));
  }, [books, bookFilters, hasActiveFilters]);

  const handlePrimaryChange = (id) => {
    if (id === PRIMARY_TAB_OTHERS || id === PRIMARY_TAB_SEARCH) {
      setDiscoverActiveTab({ primary: id, secondary: null });
      navigate(buildDiscoverUrl(id));
      return;
    }
    const tabs = SECONDARY_TABS_BY_PRIMARY[id] ?? [];
    const defaultId = DEFAULT_SECONDARY_BY_PRIMARY[id];
    const keepSection = tabs.some((t) => t.id === activeSecondary) ? activeSecondary : defaultId;
    setDiscoverActiveTab({ primary: id, secondary: keepSection });
    navigate(buildDiscoverUrl(id, keepSection));
  };

  const handleSecondaryChange = (id) => {
    setDiscoverActiveTab({ primary: activePrimary, secondary: id });
    navigate(buildDiscoverUrl(activePrimary, id));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query || loading) return;
    // Same keyword: search again instead of leaving the button looking dead.
    if (query === submittedQuery) {
      setRefreshKey((key) => key + 1);
      return;
    }
    setDiscoverActiveTab({ primary: PRIMARY_TAB_SEARCH, secondary: null });
    navigate(buildDiscoverUrl(PRIMARY_TAB_SEARCH, null, query));
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setDiscoverActiveTab({ primary: PRIMARY_TAB_SEARCH, secondary: null });
    navigate(buildDiscoverUrl(PRIMARY_TAB_SEARCH));
  };

  const handleRefresh = () => {
    if (loading) return;
    setRefreshKey((key) => key + 1);
  };

  const handleToggleAll = useCallback(async (bookIds, shouldInclude) => {
    const ids = (Array.isArray(bookIds) ? bookIds : [bookIds]).map(String);
    try {
      if (shouldInclude) {
        await addBooksToReadingHistory(ids);
      } else {
        await removeBooksFromReadingHistory(ids);
      }
      await reloadCollectionData();
    } catch (err) {
      notifyError(err, '更新「全部」失敗，請稍後再試。');
    }
  }, [reloadCollectionData, notifyError]);

  const sortedBooks = useMemo(
    () => sortDiscoverBooks(filteredBooks, sortBy, sortDirection),
    [filteredBooks, sortBy, sortDirection],
  );

  const baseBookCardProps = (book) => ({
    book,
    conversionMode,
    sortBy,
    onClick: () => navigate(buildCatalogUrl(book.book_id)),
  });

  const bookListCardProps = (book) => ({
    ...baseBookCardProps(book),
    onAddToCollection: openAddToCollection,
  });

  if (redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  if (searchRedirectTo) {
    return <Navigate to={searchRedirectTo} replace />;
  }

  const showListContent = activePrimary !== PRIMARY_TAB_OTHERS;
  const showSearchContent = activePrimary === PRIMARY_TAB_SEARCH;
  const showDiscoverContent = showListContent && !showSearchContent;

  return (
    <DiscoverSection>
      <DiscoverToolbar
        activePrimary={activePrimary}
        activeSecondary={activeSecondary}
        secondaryTabs={secondaryTabs}
        showDiscoverContent={showDiscoverContent}
        showSearchContent={showSearchContent}
        showListContent={showListContent}
        loading={loading}
        searchInput={searchInput}
        viewMode={viewMode}
        sortBy={sortBy}
        sortDirection={sortDirection}
        onPrimaryChange={handlePrimaryChange}
        onSecondaryChange={handleSecondaryChange}
        onRefresh={handleRefresh}
        onSearchInputChange={(e) => setSearchInput(e.target.value)}
        onSearchSubmit={handleSearchSubmit}
        onSearchClear={handleSearchClear}
        onViewModeChange={handleViewModeChange}
        onSortChange={handleSortChange}
        onSortDirectionToggle={handleSortDirectionToggle}
        filterCategories={filterCategories}
        bookFilters={bookFilters}
        onBookFiltersChange={setBookFilters}
        filtersExpanded={filtersExpanded}
        onFiltersExpandedChange={setFiltersExpanded}
        conversionMode={conversionMode}
        filterItems={books}
        getFilterMeta={extractDiscoverBookFilterMeta}
        filteredCount={filteredBooks.length}
      />

      {activePrimary === PRIMARY_TAB_OTHERS && (
        <OthersPanel>
          <DiscoverBookIdForm embedded autoFocus />
          <DiscoverHelp embedded />
        </OthersPanel>
      )}

      {showSearchContent && !submittedQuery && (
        <EmptyHint>輸入關鍵字後按搜尋</EmptyHint>
      )}

      {showListContent && loading && (
        <DiscoverBookSkeletons viewMode={viewMode} />
      )}

      {showDiscoverContent && !loading && error && <EmptyHint>{error}</EmptyHint>}

      {showSearchContent && submittedQuery && !loading && error && (
        <EmptyHint>{error}</EmptyHint>
      )}

      {showSearchContent && submittedQuery && !loading && !error && filteredBooks.length === 0 && (
        <EmptyHint>找不到相關書籍</EmptyHint>
      )}

      {showDiscoverContent && !loading && !error && books.length === 0 && (
        <EmptyHint>暫無書籍</EmptyHint>
      )}

      {showListContent && !loading && !error && books.length > 0 && filteredBooks.length === 0 && (
        <EmptyHint>沒有符合的書籍</EmptyHint>
      )}

      {showListContent && !loading && !error && sortedBooks.length > 0 && (
        <DiscoverBookList
          viewMode={viewMode}
          sortedBooks={sortedBooks}
          baseBookCardProps={baseBookCardProps}
          bookListCardProps={bookListCardProps}
        />
      )}

      {showSearchContent && submittedQuery && !loading && !error && books.length >= SEARCH_RESULT_LIMIT && sortedBooks.length > 0 && (
        <SearchResultCapHint>
          顯示前 {SEARCH_RESULT_LIMIT} 筆結果，請嘗試更精確的關鍵字
        </SearchResultCapHint>
      )}

      {addToCollectionBookIds && (
        <CollectionModal
          bookIds={addToCollectionBookIds}
          collections={collections}
          newCollectionName={newCollectionName}
          onNewCollectionNameChange={setNewCollectionName}
          onClose={closeAddToCollection}
          onToggleBooks={handleToggleBooksInCollection}
          onCreateCollection={handleCreateCollectionFromModal}
          showAllOption
          allBookIds={allBookIds}
          onToggleAll={handleToggleAll}
        />
      )}
    </DiscoverSection>
  );
}

export default DiscoverBooks;
