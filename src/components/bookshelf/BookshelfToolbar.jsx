import {
  Plus,
  Folders,
  Hand,
  ListChecks,
  Search,
  X,
} from 'lucide-react';
import SelectDropdown from '../ui/SelectDropdown';
import { BOOKSHELF_SORT_OPTIONS } from '../../utils/book/bookListSort';
import { buildDefaultDiscoverUrl } from '../../utils/navigation';
import { ALL_TAB } from './constants';
import BookFilterPanel from '../book/BookFilterPanel';
import {
  ToolbarRoot,
  Tab,
  TabInner,
  TabName,
  TabCount,
  SearchBar,
  SearchRow,
  SearchInput,
  SearchClearBtn,
  TabActions,
  ToolbarRight,
  ViewToggle,
  SortUnit,
  SortTrailingBtn,
  BtnLabel,
  ToggleBtn,
  TOOLBAR_SORT_DROPDOWN_PROPS,
} from '../layout/BookToolbarStyles';
import ListGridViewToggle from '../layout/ListGridViewToggle';
import SortDirectionButton from '../layout/SortDirectionButton';
import { ScrollableTabBar } from '../layout/ScrollableTabBar';

function BookshelfToolbar({
  activeTab,
  onActiveTabChange,
  readingHistory,
  collections,
  searchQuery,
  onSearchQueryChange,
  onOpenCollectionManagement,
  sortBy,
  onSortChange,
  sortDirection,
  onSortDirectionToggle,
  canReorder,
  reorderMode,
  hasSearch,
  hasActiveFilters,
  onReorderModeToggle,
  manageMode,
  onManageModeToggle,
  viewMode,
  onViewModeChange,
  navigate,
  filterCategories,
  bookFilters,
  onBookFiltersChange,
  filtersExpanded,
  onFiltersExpandedChange,
  conversionMode,
  filterItems,
  getFilterMeta,
  filteredCount,
}) {
  return (
    <ToolbarRoot>
      <ScrollableTabBar>
        <Tab
          $active={activeTab === ALL_TAB}
          onClick={() => onActiveTabChange(ALL_TAB)}
          title={`全部 (${readingHistory.length})`}
        >
          <TabInner>
            <TabName>全部</TabName>
            <TabCount>({readingHistory.length})</TabCount>
          </TabInner>
        </Tab>
        {collections.map((col) => (
          <Tab
            key={col.id}
            $active={activeTab === col.id}
            onClick={() => onActiveTabChange(col.id)}
            title={`${col.name} (${col.bookIds.length})`}
          >
            <TabInner>
              <TabName>{col.name}</TabName>
              <TabCount>({col.bookIds.length})</TabCount>
            </TabInner>
          </Tab>
        ))}
      </ScrollableTabBar>

      <SearchRow>
        <SearchBar>
          <Search className="search-icon" aria-hidden />
          <SearchInput
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="搜尋書名、作者、簡介、標籤等"
            aria-label="搜尋書名、作者、簡介、標籤等"
          />
          {searchQuery && (
            <SearchClearBtn
              type="button"
              onClick={() => onSearchQueryChange('')}
              title="清除搜尋"
              aria-label="清除搜尋"
            >
              <X />
            </SearchClearBtn>
          )}
        </SearchBar>
        <ViewToggle>
          <ToggleBtn
            type="button"
            onClick={onOpenCollectionManagement}
            title="管理收藏夾"
            aria-label="管理收藏夾"
          >
            <Folders />
            <BtnLabel>收藏夾</BtnLabel>
          </ToggleBtn>
        </ViewToggle>
      </SearchRow>

      <BookFilterPanel
        categories={filterCategories}
        filters={bookFilters}
        conversionMode={conversionMode}
        onFiltersChange={onBookFiltersChange}
        expanded={filtersExpanded}
        onExpandedChange={onFiltersExpandedChange}
        filterItems={filterItems}
        getFilterMeta={getFilterMeta}
        filteredCount={filteredCount}
      />

      <TabActions>
        <ToolbarRight>
          <SortUnit>
            <SelectDropdown
              options={BOOKSHELF_SORT_OPTIONS}
              value={sortBy}
              onChange={onSortChange}
              ariaLabel="書架排序方式"
              hasTrailing={sortBy !== 'manual' || canReorder}
              {...TOOLBAR_SORT_DROPDOWN_PROPS}
            />
            {sortBy !== 'manual' ? (
              <SortDirectionButton
                sortDirection={sortDirection}
                onToggle={onSortDirectionToggle}
              />
            ) : canReorder && !hasSearch && !hasActiveFilters ? (
              <SortTrailingBtn
                type="button"
                $active={reorderMode}
                onClick={onReorderModeToggle}
                title="調整排序"
                aria-label="調整排序"
                aria-pressed={reorderMode}
              >
                <Hand />
                <BtnLabel>調序</BtnLabel>
              </SortTrailingBtn>
            ) : null}
          </SortUnit>
          <ViewToggle>
            <ToggleBtn
              $active={manageMode}
              onClick={onManageModeToggle}
              title="管理書籍"
              aria-label="管理書籍"
              aria-pressed={manageMode}
            >
              <ListChecks />
              <BtnLabel>管理</BtnLabel>
            </ToggleBtn>
          </ViewToggle>
          <ViewToggle>
            <ToggleBtn
              type="button"
              onClick={() => navigate(buildDefaultDiscoverUrl())}
              title="新增書籍"
              aria-label="新增書籍"
            >
              <Plus />
              <BtnLabel>新書</BtnLabel>
            </ToggleBtn>
          </ViewToggle>
          <ListGridViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
        </ToolbarRight>
      </TabActions>
    </ToolbarRoot>
  );
}

export default BookshelfToolbar;
