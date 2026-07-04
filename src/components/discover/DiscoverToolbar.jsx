import { Loader2, RefreshCw } from 'lucide-react';
import { DISCOVER_SORT_OPTIONS } from '../../utils/book/bookListSort';
import SelectDropdown from '../ui/SelectDropdown';
import { CardSpinningIcon } from '../book/CardActionButton';
import {
  SortUnit,
  Tab,
  TabActions,
  TOOLBAR_SORT_DROPDOWN_PROPS,
  ToolbarRight,
} from '../layout/BookToolbarStyles';
import ListGridViewToggle from '../layout/ListGridViewToggle';
import SortDirectionButton from '../layout/SortDirectionButton';
import { ScrollableTabBar } from '../layout/ScrollableTabBar';
import { ScrollableSecondaryTabBar } from './ScrollableSecondaryTabBar';
import { PRIMARY_TABS } from './constants';
import DiscoverSearchForm from './DiscoverSearchForm';
import BookFilterPanel from '../book/BookFilterPanel';
import {
  SecondaryRefreshBtn,
  SecondaryTab,
  SecondaryTabRow,
  TabStack,
} from './styles';

function DiscoverToolbar({
  activePrimary,
  activeSecondary,
  secondaryTabs,
  showDiscoverContent,
  showSearchContent,
  showListContent,
  loading,
  searchInput,
  submittedQuery,
  viewMode,
  sortBy,
  sortDirection,
  onPrimaryChange,
  onSecondaryChange,
  onRefresh,
  onSearchInputChange,
  onSearchSubmit,
  onSearchClear,
  onViewModeChange,
  onSortChange,
  onSortDirectionToggle,
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
  const filterPanel = showListContent ? (
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
  ) : null;

  return (
    <TabStack>
      <ScrollableTabBar>
        {PRIMARY_TABS.map((tab) => (
          <Tab
            key={tab.id}
            type="button"
            $active={activePrimary === tab.id}
            onClick={() => onPrimaryChange(tab.id)}
          >
            {tab.label}
          </Tab>
        ))}
      </ScrollableTabBar>

      {showDiscoverContent && secondaryTabs.length > 0 && (
        <SecondaryTabRow>
          <ScrollableSecondaryTabBar>
            {secondaryTabs.map((tab) => (
              <SecondaryTab
                key={tab.id}
                type="button"
                $active={activeSecondary === tab.id}
                onClick={() => onSecondaryChange(tab.id)}
              >
                {tab.label}
              </SecondaryTab>
            ))}
          </ScrollableSecondaryTabBar>
          <SecondaryRefreshBtn
            type="button"
            title="刷新列表"
            aria-label="刷新列表"
            disabled={loading}
            onClick={onRefresh}
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

      {showDiscoverContent && filterPanel}

      {showSearchContent && (
        <DiscoverSearchForm
          searchInput={searchInput}
          submittedQuery={submittedQuery}
          loading={loading}
          onSearchInputChange={onSearchInputChange}
          onSubmit={onSearchSubmit}
          onClear={onSearchClear}
        />
      )}

      {showSearchContent && filterPanel}

      {showListContent && (
        <TabActions>
          <ToolbarRight>
            <SortUnit>
              <SelectDropdown
                options={DISCOVER_SORT_OPTIONS}
                value={sortBy}
                onChange={onSortChange}
                ariaLabel="探索排序方式"
                hasTrailing={sortBy !== 'default'}
                {...TOOLBAR_SORT_DROPDOWN_PROPS}
              />
              {sortBy !== 'default' && (
                <SortDirectionButton
                  sortDirection={sortDirection}
                  onToggle={onSortDirectionToggle}
                />
              )}
            </SortUnit>
            <ListGridViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
          </ToolbarRight>
        </TabActions>
      )}
    </TabStack>
  );
}

export default DiscoverToolbar;
