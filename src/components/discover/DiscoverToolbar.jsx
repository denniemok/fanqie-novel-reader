import { ArrowDownZA, ArrowUpAZ, Grid2X2, LayoutList, Loader2, RefreshCw } from 'lucide-react';
import { DISCOVER_SORT_OPTIONS } from '../../utils/book/bookListSort';
import SelectDropdown from '../ui/SelectDropdown';
import { CardSpinningIcon } from '../book/CardActionButton';
import {
  BtnLabel,
  SortTrailingBtn,
  SortUnit,
  TabActions,
  TabBar,
  Tab,
  ToggleBtn,
  ToolbarRight,
  ViewToggle,
} from '../layout/BookToolbarStyles';
import { PRIMARY_TABS } from './constants';
import DiscoverSearchForm from './DiscoverSearchForm';
import BookFilterPanel from '../book/BookFilterPanel';
import {
  SecondaryRefreshBtn,
  SecondaryTab,
  SecondaryTabBar,
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
      <TabBar>
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
      </TabBar>

      {showDiscoverContent && secondaryTabs.length > 0 && (
        <SecondaryTabRow>
          <SecondaryTabBar>
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
          </SecondaryTabBar>
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
                  onClick={onSortDirectionToggle}
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
                onClick={() => onViewModeChange('list')}
                title="列表視圖"
                aria-label="列表視圖"
              >
                <LayoutList />
                <BtnLabel>列表</BtnLabel>
              </ToggleBtn>
              <ToggleBtn
                type="button"
                $active={viewMode === 'grid'}
                onClick={() => onViewModeChange('grid')}
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
  );
}

export default DiscoverToolbar;
