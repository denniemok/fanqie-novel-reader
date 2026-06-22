import {
  ArrowDownZA,
  ArrowUpAZ,
  Grid2X2,
  LayoutList,
  Plus,
  Folders,
  Hand,
  Settings,
  Search,
  X,
} from 'lucide-react';
import SelectDropdown from '../common/SelectDropdown';
import { BOOKSHELF_SORT_OPTIONS } from '../../utils/bookshelfSort';
import { ROUTES } from '../../utils/navigation';
import { ALL_TAB } from './constants';
import {
  ToolbarRoot,
  TabBar,
  Tab,
  TabInner,
  TabName,
  TabCount,
  SearchBar,
  SearchInput,
  SearchClearBtn,
  TabActions,
  ToolbarRight,
  ViewToggle,
  SortUnit,
  SortTrailingBtn,
  BtnLabel,
  ToggleBtn,
} from './styles';

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
  onReorderModeToggle,
  settingsMode,
  onSettingsModeToggle,
  viewMode,
  onViewModeChange,
  navigate,
}) {
  return (
    <ToolbarRoot>
      <TabBar>
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
      </TabBar>

      <SearchBar>
        <Search className="search-icon" aria-hidden />
        <SearchInput
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="搜尋書名或作者"
          aria-label="搜尋書名或作者"
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

      <TabActions>
        <ToolbarRight>
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
          <SortUnit>
            <SelectDropdown
              options={BOOKSHELF_SORT_OPTIONS}
              value={sortBy}
              onChange={onSortChange}
              ariaLabel="書架排序方式"
              attachedLabel="排序"
              hideAttachedLabelOnMobile
              embedded
              square
              retro
              hasTrailing={sortBy !== 'manual' || canReorder}
              menuAlign="left"
              triggerMinWidth={108}
              triggerMinWidthMobile={72}
              triggerBold
            />
            {sortBy !== 'manual' ? (
              <SortTrailingBtn
                type="button"
                onClick={onSortDirectionToggle}
                title={sortDirection === 'desc' ? '由高到低（點擊切換）' : '由低到高（點擊切換）'}
                aria-label={sortDirection === 'desc' ? '降序排列' : '升序排列'}
              >
                {sortDirection === 'desc' ? <ArrowDownZA /> : <ArrowUpAZ />}
                <BtnLabel>{sortDirection === 'desc' ? '降序' : '升序'}</BtnLabel>
              </SortTrailingBtn>
            ) : canReorder && !hasSearch ? (
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
              $active={settingsMode}
              onClick={onSettingsModeToggle}
              title="管理書籍"
              aria-label="管理書籍"
              aria-pressed={settingsMode}
            >
              <Settings />
              <BtnLabel>管理</BtnLabel>
            </ToggleBtn>
          </ViewToggle>
          <ViewToggle>
            <ToggleBtn
              type="button"
              onClick={() => navigate(ROUTES.newBook)}
              title="新增書籍"
              aria-label="新增書籍"
            >
              <Plus />
              <BtnLabel>新書</BtnLabel>
            </ToggleBtn>
          </ViewToggle>
          <ViewToggle>
            <ToggleBtn
              $active={viewMode === 'list'}
              onClick={() => onViewModeChange('list')}
              title="列表視圖"
              aria-label="列表視圖"
            >
              <LayoutList />
              <BtnLabel>列表</BtnLabel>
            </ToggleBtn>
            <ToggleBtn
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
    </ToolbarRoot>
  );
}

export default BookshelfToolbar;
