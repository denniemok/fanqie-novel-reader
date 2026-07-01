import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams, Navigate } from 'react-router-dom';
import { buildCatalogUrl, buildDiscoverUrl } from '../../utils/navigation';
import { sortDiscoverBooks } from '../../utils/bookshelfSort';
import { GridLayout, ListLayout } from '../bookshelf/styles';
import {
  getBookshelfViewMode,
  setBookshelfViewMode,
  getDiscoverSort,
  setDiscoverSort,
  getDiscoverSortDirection,
  setDiscoverSortDirection,
} from '../../utils/storage';
import { useDiscoverBookList } from '../../hooks/useDiscoverBookList';
import {
  DEFAULT_SECONDARY_BY_PRIMARY,
  PRIMARY_TAB_OTHERS,
  PRIMARY_TAB_SEARCH,
  resolveDiscoverRoute,
  SECONDARY_TABS_BY_PRIMARY,
} from './constants';
import Section from './Section';
import EmptyHint from '../common/EmptyHint';
import Help from './Help';
import Form from './Form';
import DiscoverToolbar from './DiscoverToolbar';
import DiscoverBookCard from './DiscoverBookCard';
import DiscoverBookListCard from './DiscoverBookListCard';
import DiscoverBookSkeletons from './DiscoverBookSkeletons';
import { OthersPanel } from './styles';

function DiscoverBooks({ conversionMode = 'tw' }) {
  const navigate = useNavigate();
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
  const [viewMode, setViewModeState] = useState(getBookshelfViewMode);
  const [sortBy, setSortByState] = useState(getDiscoverSort);
  const [sortDirection, setSortDirectionState] = useState(getDiscoverSortDirection);
  const [searchInput, setSearchInput] = useState(submittedQuery);

  const skipFetch = Boolean(redirectTo || searchRedirectTo);
  const { books, loading, error } = useDiscoverBookList({
    activePrimary,
    activeSecondary,
    submittedQuery,
    refreshKey,
    skip: skipFetch,
  });

  useEffect(() => {
    setSearchInput(submittedQuery);
  }, [submittedQuery]);

  const handlePrimaryChange = (id) => {
    if (id === PRIMARY_TAB_OTHERS || id === PRIMARY_TAB_SEARCH) {
      navigate(buildDiscoverUrl(id));
      return;
    }
    const tabs = SECONDARY_TABS_BY_PRIMARY[id] ?? [];
    const defaultId = DEFAULT_SECONDARY_BY_PRIMARY[id];
    const keepSection = tabs.some((t) => t.id === activeSecondary) ? activeSecondary : defaultId;
    navigate(buildDiscoverUrl(id, keepSection));
  };

  const handleSecondaryChange = (id) => {
    navigate(buildDiscoverUrl(activePrimary, id));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query || loading || query === submittedQuery) return;
    navigate(buildDiscoverUrl(PRIMARY_TAB_SEARCH, null, query));
  };

  const handleSearchClear = () => {
    setSearchInput('');
    navigate(buildDiscoverUrl(PRIMARY_TAB_SEARCH));
  };

  const handleRefresh = () => {
    if (loading) return;
    setRefreshKey((key) => key + 1);
  };

  const handleViewModeChange = (mode) => {
    setViewModeState(mode);
    setBookshelfViewMode(mode);
  };

  const handleSortChange = (next) => {
    setSortByState(next);
    setDiscoverSort(next);
  };

  const handleSortDirectionToggle = () => {
    const next = sortDirection === 'desc' ? 'asc' : 'desc';
    setSortDirectionState(next);
    setDiscoverSortDirection(next);
  };

  const sortedBooks = useMemo(
    () => sortDiscoverBooks(books, sortBy, sortDirection),
    [books, sortBy, sortDirection],
  );

  const bookCardProps = (book) => ({
    book,
    conversionMode,
    sortBy,
    onClick: () => navigate(buildCatalogUrl(book.book_id)),
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
    <Section>
      <DiscoverToolbar
        activePrimary={activePrimary}
        activeSecondary={activeSecondary}
        secondaryTabs={secondaryTabs}
        showDiscoverContent={showDiscoverContent}
        showSearchContent={showSearchContent}
        showListContent={showListContent}
        loading={loading}
        searchInput={searchInput}
        submittedQuery={submittedQuery}
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
      />

      {activePrimary === PRIMARY_TAB_OTHERS && (
        <OthersPanel>
          <Form embedded autoFocus />
          <Help embedded />
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

      {showSearchContent && submittedQuery && !loading && !error && books.length === 0 && (
        <EmptyHint>找不到相關書籍</EmptyHint>
      )}

      {showDiscoverContent && !loading && !error && books.length === 0 && (
        <EmptyHint>暫無書籍</EmptyHint>
      )}

      {showListContent && !loading && !error && sortedBooks.length > 0 && (
        viewMode === 'list' ? (
          <ListLayout>
            {sortedBooks.map((book) => (
              <DiscoverBookListCard key={book.book_id} {...bookCardProps(book)} />
            ))}
          </ListLayout>
        ) : (
          <GridLayout>
            {sortedBooks.map((book) => (
              <DiscoverBookCard key={book.book_id} {...bookCardProps(book)} />
            ))}
          </GridLayout>
        )
      )}
    </Section>
  );
}

export default DiscoverBooks;
