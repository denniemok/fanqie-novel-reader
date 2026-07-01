import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams, Navigate } from 'react-router-dom';
import { ArrowDownZA, ArrowUpAZ, Grid2X2, LayoutList, Loader2, RefreshCw, Search, X } from 'lucide-react';
import styled from 'styled-components';
import {
  fetchHomepageBookList,
  fetchRankBookList,
  fetchSearchBooks,
} from '../../services/api';
import { buildCatalogUrl, buildDiscoverUrl } from '../../utils/navigation';
import { formatErrorMessage } from '../../utils/errors';
import { normalizeDiscoverBookInfo } from '../../utils/bookInfo';
import { DISCOVER_SORT_OPTIONS, sortDiscoverBooks } from '../../utils/bookshelfSort';
import SelectDropdown from '../common/SelectDropdown';
import { useConvertedText } from '../../hooks/useConvertedText';
import { shimmerStyle } from '../../utils/styled/animations';
import { GridLayout, ListLayout, TabBar, Tab, SearchBar, SearchInput, ViewToggle, ToggleBtn, BtnLabel, SortUnit, SortTrailingBtn, TOOLBAR_CONTROL_HEIGHT, TabActions, ToolbarRight } from '../bookshelf/styles';
import BookInfo from '../common/BookInfo';
import { getBookshelfViewMode, setBookshelfViewMode, getDiscoverSort, setDiscoverSort, getDiscoverSortDirection, setDiscoverSortDirection } from '../../utils/storage';
import {
  DEFAULT_SECONDARY_BY_PRIMARY,
  HOMEPAGE_SECTIONS,
  PRIMARY_ERROR_MESSAGES,
  PRIMARY_TAB_OTHERS,
  PRIMARY_TAB_RANK,
  PRIMARY_TAB_RECOMMEND,
  PRIMARY_TAB_SEARCH,
  PRIMARY_TABS,
  resolveDiscoverRoute,
  SECONDARY_TABS_BY_PRIMARY,
} from './constants';
import Section from './Section';
import EmptyHint from '../common/EmptyHint';
import { CardSpinningIcon } from '../common/CardActionButton';
import { IconButton } from '../common/IconButton';
import Help from './Help';
import Form from './Form';

const SearchForm = styled.form`
  display: flex;
  align-items: stretch;
  gap: 10px;
`;

const InlineSearchBar = styled(SearchBar)`
  flex: 1;
  min-width: 0;
  width: auto;
`;

const SearchClearIconBtn = styled.button`
  padding: 0;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border: none;
  background: transparent;
  color: var(--text-color-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    color: var(--accent-color);
  }
`;

const SearchSubmitBtn = styled.button`
  flex-shrink: 0;
  padding: 0 20px;
  min-height: 44px;
  height: 44px;
  border-radius: 0;
  border: var(--retro-border-width) solid var(--border-color);
  background: var(--accent-color);
  color: var(--text-on-accent);
  font-size: 14px;
  font-weight: 600;
  font-family: var(--ui-font-family);
  cursor: pointer;
  box-shadow: var(--retro-shadow);
  transition: var(--transition-default);

  &:hover:not(:disabled) {
    background: var(--accent-hover);
    transform: translate(-1px, -1px);
    box-shadow: var(--retro-shadow-hover);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 30;
  overflow: visible;
`;

const SecondaryTabRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
`;

const SecondaryTabBar = styled(TabBar)`
  flex: 1;
  min-width: 0;
  height: ${TOOLBAR_CONTROL_HEIGHT};
  border-radius: 0;
  background: color-mix(in srgb, var(--background-color2) 70%, transparent);
`;

const SecondaryRefreshBtn = styled(IconButton)`
  flex-shrink: 0;
  min-width: ${TOOLBAR_CONTROL_HEIGHT};
  width: ${TOOLBAR_CONTROL_HEIGHT};
  height: ${TOOLBAR_CONTROL_HEIGHT};
  padding: 0;
  border-radius: 0;
`;

const SecondaryTab = styled(Tab)`
  display: flex;
  align-items: center;
  height: 100%;
  min-height: 0;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
  max-width: 160px;
  border-radius: 0;

  @media (max-width: 374px) {
    padding: 0 10px;
    font-size: 12px;
    max-width: 120px;
  }
`;

const ListCard = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  gap: 20px;
  border-radius: var(--border-radius-sm);
  background: var(--card-surface);
  border: var(--retro-border-width) solid var(--border-color);
  cursor: pointer;
  transition: var(--transition-default);
  overflow: hidden;
  box-shadow: var(--retro-shadow);

  @media (max-width: 480px) {
    padding: 16px;
    gap: 16px;
  }

  &:hover {
    border-color: var(--accent-color);
    background-color: var(--hover-background-color);
    transform: translate(-2px, -2px);
    box-shadow: var(--retro-shadow-hover);
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: none;
  }
`;

const ListSkeletonCard = styled.div`
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  gap: 20px;
  border-radius: var(--border-radius-sm);
  background-color: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  box-shadow: var(--retro-shadow);

  @media (max-width: 480px) {
    padding: 16px;
    gap: 16px;
  }
`;

const ListSkeletonCover = styled.div`
  width: 100px;
  height: 134px;
  flex-shrink: 0;
  border: 1px solid var(--border-color);
  background-color: var(--cover-bg);
  ${shimmerStyle}

  @media (max-width: 480px) {
    width: 80px;
    height: 107px;
  }
`;

const ListSkeletonText = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
`;

const OthersPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background: var(--card-surface);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: var(--retro-shadow);
  transition: var(--transition-default);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, var(--accent-soft) 0%, transparent 55%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
  }

  &:hover {
    border-color: var(--accent-color);
    background-color: var(--hover-background-color);
    transform: translate(-2px, -2px);
    box-shadow: var(--retro-shadow-hover);

    &::after {
      opacity: 0.5;
    }

    img {
      transform: scale(1.03);
    }
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: none;
  }
`;

const CoverWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const CoverImg = styled.img`
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  background-color: var(--cover-bg);
  opacity: 0.9;
  border-bottom: 1px solid var(--border-color);
  display: block;
  transition: transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1);
`;

const CoverPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  background-color: var(--cover-bg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--text-color-secondary);
`;

const CoverMetaOverlayBottom = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  max-width: 100%;
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  pointer-events: none;
`;

const CoverMetaLine = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: var(--text-on-accent);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  width: fit-content;
  max-width: 100%;
  box-sizing: border-box;
  padding: 3px 6px;
  background: rgba(201, 128, 154, 0.85);
  border: 1px solid rgba(255, 248, 245, 0.4);
`;

const Info = styled.div`
  padding: 8px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-height: 62px;
  box-sizing: border-box;

  @media (max-width: 480px) {
    min-height: 58px;
  }
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 600;
  font-family: var(--display-font-family);
  color: var(--text-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.35;
  min-height: calc(13px * 1.35 * 2);

  @media (max-width: 480px) {
    font-size: 12px;
    min-height: calc(12px * 1.35 * 2);
  }
`;

const Author = styled.div`
  font-size: 11px;
  color: var(--accent-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.85;
  min-height: 11px;
`;

const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background-color: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  box-shadow: var(--retro-shadow);
`;

const SkeletonCover = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  ${shimmerStyle}
`;

const SkeletonText = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SkeletonLine = styled.div`
  height: ${(p) => p.$height || '12px'};
  width: ${(p) => p.$width || '100%'};
  ${shimmerStyle}
`;

function toDiscoverBookInfo(book) {
  return { book_info: normalizeDiscoverBookInfo(book) };
}

function DiscoverBookCard({ book, conversionMode, onClick, sortBy = 'default' }) {
  const info = normalizeDiscoverBookInfo(book);
  const convertedName = useConvertedText(info.book_name, conversionMode);
  const convertedAuthor = useConvertedText(info.author, conversionMode);
  const convertedCategory = useConvertedText(info.category, conversionMode);
  const convertedWordCount = useConvertedText(info.word_number, conversionMode);
  const [imgError, setImgError] = useState(false);

  const coverMetaLines = (() => {
    switch (sortBy) {
      case 'default':
        return convertedCategory
          ? [<CoverMetaLine key="category">{convertedCategory}</CoverMetaLine>]
          : [];
      case 'rating':
        return info.score ? [<CoverMetaLine key="score">評分 {info.score}</CoverMetaLine>] : [];
      case 'update':
        return info.last_publish_time
          ? [<CoverMetaLine key="update">更新 {info.last_publish_time}</CoverMetaLine>]
          : [];
      case 'words':
        return info.word_number
          ? [<CoverMetaLine key="words">{convertedWordCount}字</CoverMetaLine>]
          : [];
      default:
        return [];
    }
  })();

  return (
    <Card
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <CoverWrapper>
        {info.thumb_url && !imgError ? (
          <CoverImg src={info.thumb_url} alt="" loading="lazy" onError={() => setImgError(true)} />
        ) : (
          <CoverPlaceholder>無封面</CoverPlaceholder>
        )}
        {coverMetaLines.length > 0 && (
          <CoverMetaOverlayBottom>
            {coverMetaLines}
          </CoverMetaOverlayBottom>
        )}
      </CoverWrapper>
      <Info>
        <Title>{convertedName || book.book_id}</Title>
        <Author>{convertedAuthor || '\u00A0'}</Author>
      </Info>
    </Card>
  );
}

function DiscoverBookListCard({ book, conversionMode, onClick }) {
  return (
    <ListCard
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <BookInfo
        bookInfo={toDiscoverBookInfo(book)}
        conversionMode={conversionMode}
        variant="compact"
        showChapterCount={false}
      />
    </ListCard>
  );
}

function fetchDiscoverList(primaryId, secondaryId, { signal } = {}) {
  if (primaryId === PRIMARY_TAB_RECOMMEND) {
    if (HOMEPAGE_SECTIONS.has(secondaryId)) {
      return fetchHomepageBookList(secondaryId, { signal });
    }
    return Promise.resolve([]);
  }

  if (primaryId === PRIMARY_TAB_RANK) {
    return fetchRankBookList(secondaryId, { signal });
  }

  return Promise.resolve([]);
}

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

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [viewMode, setViewModeState] = useState(getBookshelfViewMode);
  const [sortBy, setSortByState] = useState(getDiscoverSort);
  const [sortDirection, setSortDirectionState] = useState(getDiscoverSortDirection);
  const [searchInput, setSearchInput] = useState(submittedQuery);

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

  useEffect(() => {
    if (redirectTo || searchRedirectTo) return undefined;

    if (activePrimary === PRIMARY_TAB_OTHERS) {
      setLoading(false);
      setError(null);
      setBooks([]);
      return undefined;
    }

    if (activePrimary === PRIMARY_TAB_SEARCH) {
      if (!submittedQuery) {
        setLoading(false);
        setError(null);
        setBooks([]);
        return undefined;
      }

      const controller = new AbortController();
      setLoading(true);
      setError(null);
      setBooks([]);

      fetchSearchBooks(submittedQuery, { signal: controller.signal })
        .then((list) => {
          setBooks(list);
          setLoading(false);
        })
        .catch((err) => {
          if (err.name === 'AbortError') return;
          console.error('搜尋書籍失敗:', submittedQuery, err);
          setError(formatErrorMessage(err, PRIMARY_ERROR_MESSAGES[PRIMARY_TAB_SEARCH]));
          setLoading(false);
        });

      return () => controller.abort();
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setBooks([]);

    fetchDiscoverList(activePrimary, activeSecondary, { signal: controller.signal })
      .then((list) => {
        setBooks(list);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('獲取書籍列表失敗:', activePrimary, activeSecondary, err);
        setError(formatErrorMessage(err, PRIMARY_ERROR_MESSAGES[activePrimary]));
        setLoading(false);
      });

    return () => controller.abort();
  }, [redirectTo, searchRedirectTo, activePrimary, activeSecondary, submittedQuery, refreshKey]);

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
      <TabStack>
        <TabBar>
          {PRIMARY_TABS.map((tab) => (
            <Tab
              key={tab.id}
              type="button"
              $active={activePrimary === tab.id}
              onClick={() => handlePrimaryChange(tab.id)}
            >
              {tab.label}
            </Tab>
          ))}
        </TabBar>

        {showDiscoverContent && secondaryTabs.length > 0 && (
          <SecondaryTabRow>
            <SecondaryTabBar>
              {secondaryTabs.map((tab) => (
                <SecondaryTab
                  key={tab.id}
                  type="button"
                  $active={activeSecondary === tab.id}
                  onClick={() => handleSecondaryChange(tab.id)}
                >
                  {tab.label}
                </SecondaryTab>
              ))}
            </SecondaryTabBar>
            <SecondaryRefreshBtn
              type="button"
              title="刷新列表"
              aria-label="刷新列表"
              disabled={loading}
              onClick={handleRefresh}
            >
              {loading ? (
                <CardSpinningIcon>
                  <Loader2 size={18} strokeWidth={2.5} />
                </CardSpinningIcon>
              ) : (
                <RefreshCw size={18} strokeWidth={2.5} />
              )}
            </SecondaryRefreshBtn>
          </SecondaryTabRow>
        )}

        {showSearchContent && (
          <SearchForm onSubmit={handleSearchSubmit}>
            <InlineSearchBar>
              <Search className="search-icon" aria-hidden />
              <SearchInput
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="輸入書名、作者或關鍵字"
                aria-label="搜尋書籍"
              />
              {searchInput && (
                <SearchClearIconBtn
                  type="button"
                  onClick={handleSearchClear}
                  title="清除搜尋"
                  aria-label="清除搜尋"
                >
                  <X aria-hidden />
                </SearchClearIconBtn>
              )}
            </InlineSearchBar>
            <SearchSubmitBtn
              type="submit"
              disabled={!searchInput.trim() || loading || searchInput.trim() === submittedQuery}
            >
              搜尋
            </SearchSubmitBtn>
          </SearchForm>
        )}

        {showListContent && (
          <TabActions>
            <ToolbarRight>
            <SortUnit>
              <SelectDropdown
                options={DISCOVER_SORT_OPTIONS}
                value={sortBy}
                onChange={handleSortChange}
                ariaLabel="探索排序方式"
                attachedLabel="排序"
                hideAttachedLabelOnMobile
                embedded
                square
                retro
                hasTrailing={sortBy !== 'default'}
                menuAlign="left"
                triggerMinWidth={108}
                triggerMinWidthMobile={72}
                triggerBold
              />
              {sortBy !== 'default' && (
              <SortTrailingBtn
                type="button"
                onClick={handleSortDirectionToggle}
                title={sortDirection === 'desc' ? '由高到低（點擊切換）' : '由低到高（點擊切換）'}
                aria-label={sortDirection === 'desc' ? '降序排列' : '升序排列'}
              >
                {sortDirection === 'desc' ? <ArrowDownZA /> : <ArrowUpAZ />}
                <BtnLabel>{sortDirection === 'desc' ? '降序' : '升序'}</BtnLabel>
              </SortTrailingBtn>
              )}
            </SortUnit>
            <ViewToggle>
              <ToggleBtn
                type="button"
                $active={viewMode === 'list'}
                onClick={() => handleViewModeChange('list')}
                title="列表視圖"
                aria-label="列表視圖"
              >
                <LayoutList />
                <BtnLabel>列表</BtnLabel>
              </ToggleBtn>
              <ToggleBtn
                type="button"
                $active={viewMode === 'grid'}
                onClick={() => handleViewModeChange('grid')}
                title="格狀視圖"
                aria-label="格狀視圖"
              >
                <Grid2X2 />
                <BtnLabel>格狀</BtnLabel>
              </ToggleBtn>
            </ViewToggle>
            </ToolbarRight>
          </TabActions>
        )}
      </TabStack>

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
        viewMode === 'list' ? (
          <ListLayout>
            {Array.from({ length: 6 }, (_, i) => (
              <ListSkeletonCard key={i}>
                <ListSkeletonCover />
                <ListSkeletonText>
                  <SkeletonLine $height="22px" $width="70%" />
                  <SkeletonLine $height="14px" $width="40%" />
                  <SkeletonLine $height="13px" $width="90%" />
                  <SkeletonLine $height="13px" $width="75%" />
                </ListSkeletonText>
              </ListSkeletonCard>
            ))}
          </ListLayout>
        ) : (
          <GridLayout>
            {Array.from({ length: 8 }, (_, i) => (
              <SkeletonCard key={i}>
                <SkeletonCover />
                <SkeletonText>
                  <SkeletonLine $height="13px" $width="90%" />
                  <SkeletonLine $height="11px" $width="60%" />
                </SkeletonText>
              </SkeletonCard>
            ))}
          </GridLayout>
        )
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
