import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Grid2X2,
  LayoutList,
  Plus,
  BookPlus,
  FolderPlus,
  FolderInput,
  Trash2,
  X,
  Check,
  Edit2,
  Settings,
} from 'lucide-react';
import BookCard from '../common/BookCard';
import PageContent from '../common/PageContent';
import GridCard from './GridCard';
import SortableBooks from './SortableBooks';
import CollectionModal from './CollectionModal';
import ConfirmModal from '../common/ConfirmModal';
import SelectDropdown from '../common/SelectDropdown';
import {
  ModalText,
} from '../common/ModalBase';
import { useToast } from '../../contexts/ToastContext';
import { maybeConvert } from '../../utils/zh-convert';
import { buildCatalogUrl, ROUTES } from '../../utils/navigation';
import { formatErrorMessage } from '../../utils/errors';
import { SAMPLE_READING_HISTORY_BOOK_ID } from '../../utils/constants';
import {
  getReadingHistory,
  deleteBookData,
  reorderReadingHistory,
  getBookshelfViewMode,
  setBookshelfViewMode,
  getBookshelfSort,
  setBookshelfSort,
  getBookshelfSortDirection,
  setBookshelfSortDirection,
  getCollections,
  createCollection,
  deleteCollection,
  renameCollection,
  addBookToCollection,
  removeBookFromCollection,
} from '../../utils/storage';
import { BOOKSHELF_SORT_OPTIONS, sortBookshelfItems } from '../../utils/bookshelfSort';
import { useBookshelfSortMeta } from '../../hooks/useBookshelfSortMeta';

const ALL_TAB = 'all';

// ── Layout ──────────────────────────────────────────────────────────────────

const Wrapper = styled(PageContent).attrs({ $variant: 'bookshelf', $gap: 20 })``;

const TabBar = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0;
  border: 1px solid var(--border-color);
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button`
  flex-shrink: 0;
  padding: 13px 18px;
  min-height: 44px;
  background: ${(p) => (p.$active ? 'var(--accent-color)' : 'var(--background-color2)')};
  color: ${(p) => (p.$active ? '#000' : 'var(--text-color-secondary)')};
  border: none;
  border-right: 1px solid var(--border-color);
  font-size: 14px;
  font-weight: 700;
  font-family: var(--ui-font-family);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.1s steps(2);
  white-space: nowrap;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: ${(p) => (p.$active ? 'var(--accent-hover)' : 'var(--hover-background-color)')};
    color: ${(p) => (p.$active ? '#000' : 'var(--text-color)')};
  }
`;

const AddTabBtn = styled.button`
  flex-shrink: 0;
  padding: 13px 16px;
  min-height: 44px;
  background: var(--background-color2);
  color: var(--text-color-secondary);
  border: none;
  border-right: 1px solid var(--border-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.1s steps(2);

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: var(--hover-background-color);
    color: var(--accent-color);
  }
`;

const TOOLBAR_CONTROL_HEIGHT = '44px';

const NewTabRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: stretch;
`;

const NewTabInput = styled.input`
  flex: 1;
  padding: 10px 14px;
  min-height: ${TOOLBAR_CONTROL_HEIGHT};
  background: var(--background-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  font-size: 15px;
  font-family: var(--ui-font-family);
  outline: none;

  &:focus {
    border-color: var(--accent-color);
  }

  &::placeholder {
    color: var(--text-color-secondary);
    opacity: 0.5;
  }
`;

const SmallIconBtn = styled.button`
  padding: 0;
  width: ${TOOLBAR_CONTROL_HEIGHT};
  height: ${TOOLBAR_CONTROL_HEIGHT};
  box-sizing: border-box;
  border: 1px solid var(--border-color);
  background: ${(p) =>
    p.$variant === 'delete' || p.$variant === 'cancel'
      ? '#aa5555'
      : p.$variant === 'confirm'
        ? '#55aa55'
        : 'var(--background-color2)'};
  color: ${(p) => (p.$variant ? '#000' : 'var(--text-color)')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.1s steps(2);

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    filter: brightness(1.2);
  }
`;

const TabActions = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  min-height: ${TOOLBAR_CONTROL_HEIGHT};
`;

const TabActionGroup = styled.div`
  display: flex;
  align-items: stretch;
  gap: 4px;
`;

const RenameRow = styled.div`
  display: flex;
  align-items: stretch;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const ViewToggle = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0;
  height: ${TOOLBAR_CONTROL_HEIGHT};
  box-sizing: border-box;
  border: 1px solid var(--border-color);
  overflow: hidden;
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
  margin-left: auto;
  flex-wrap: wrap;
`;

const SortUnit = styled.div`
  display: inline-flex;
  align-items: stretch;
  height: ${TOOLBAR_CONTROL_HEIGHT};
  box-sizing: border-box;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: border-color 0.2s ease;

  &:hover,
  &:focus-within {
    border-color: var(--accent-color);
  }
`;

const SortTrailingBtn = styled.button`
  padding: 0 12px;
  height: 100%;
  box-sizing: border-box;
  background: ${(p) => (p.$active ? 'var(--accent-color)' : 'var(--background-color2)')};
  color: ${(p) => (p.$active ? '#000' : 'var(--accent-color)')};
  border: none;
  border-left: 1px solid var(--border-color);
  border-radius: 0 12px 12px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
  font-family: var(--ui-font-family);
  line-height: 1;
  white-space: nowrap;
  transition: background 0.2s ease;
  box-sizing: border-box;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &:hover {
    background: ${(p) => (p.$active ? 'var(--accent-hover)' : 'var(--hover-background-color)')};
  }
`;

const ReorderHint = styled.div`
  font-size: 15px;
  font-family: var(--ui-font-family);
  color: var(--accent-color);
  padding: 12px 16px;
  border: 1px dashed var(--accent-color);
  background: rgba(212, 165, 116, 0.08);
  width: 100%;
  text-align: center;
  line-height: 1.55;
`;

const ToggleBtn = styled.button`
  padding: 0 14px;
  height: 100%;
  background: ${(p) => (p.$active ? 'var(--accent-color)' : 'var(--background-color2)')};
  color: ${(p) => (p.$active ? '#000' : 'var(--text-color-secondary)')};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  font-family: var(--ui-font-family);
  line-height: 1;
  transition: all 0.1s steps(2);

  svg {
    width: 16px;
    height: 16px;
  }

  &:not(:last-child) {
    border-right: 1px solid var(--border-color);
  }

  &:hover:not([disabled]) {
    background: ${(p) => (p.$active ? 'var(--accent-hover)' : 'var(--hover-background-color)')};
  }
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  align-items: stretch;

  @media (max-width: 450px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const ListLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const EmptyHint = styled.div`
  font-size: 13px;
  color: var(--text-color-secondary);
  opacity: 0.6;
  text-align: center;
  padding: 40px 16px;
  border: 1px dashed var(--border-color);
  background: var(--background-color2);
`;

const RenameInput = styled.input`
  flex: 1;
  min-width: 0;
  height: ${TOOLBAR_CONTROL_HEIGHT};
  box-sizing: border-box;
  padding: 0 12px;
  background: var(--background-color);
  border: 1px solid var(--accent-color);
  color: var(--text-color);
  font-size: 14px;
  font-weight: 700;
  font-family: var(--ui-font-family);
  outline: none;
`;

// ── Main component ────────────────────────────────────────────────────────────

function Content({ conversionMode = 'tw' }) {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const [viewMode, setViewModeState] = useState(getBookshelfViewMode);
  const [sortBy, setSortByState] = useState(getBookshelfSort);
  const [sortDirection, setSortDirectionState] = useState(getBookshelfSortDirection);
  const [refreshKey, setRefreshKey] = useState(0);
  const [renderTick, setRenderTick] = useState(0);
  const [readingHistory, setReadingHistory] = useState([]);
  const [collections, setCollections] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [addToCollectionBookId, setAddToCollectionBookId] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewTabInput, setShowNewTabInput] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const [editingTab, setEditingTab] = useState(false);
  const [editingTabName, setEditingTabName] = useState('');
  const [reorderMode, setReorderMode] = useState(false);
  const [settingsMode, setSettingsMode] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const newTabInputRef = useRef(null);
  const renameInputRef = useRef(null);

  const reloadData = useCallback(async () => {
    const [history, cols] = await Promise.all([getReadingHistory(), getCollections()]);
    setReadingHistory(history);
    setCollections(cols);
    setDataLoaded(true);
  }, []);

  const reloadDataKeepingScroll = useCallback(async () => {
    const scrollY = window.scrollY;
    const [history, cols] = await Promise.all([getReadingHistory(), getCollections()]);
    flushSync(() => {
      setReadingHistory(history);
      setCollections(cols);
      setDataLoaded(true);
    });
    window.scrollTo(0, scrollY);
  }, []);

  useEffect(() => {
    reloadData();
  }, [refreshKey, reloadData]);

  const isSampleOnly = readingHistory.length === 0;
  const displayHistory = isSampleOnly
    ? [{ bookId: SAMPLE_READING_HISTORY_BOOK_ID }]
    : readingHistory;

  const activeCollection = activeTab !== ALL_TAB
    ? collections.find((c) => c.id === activeTab)
    : null;

  const displayBooks = activeTab === ALL_TAB
    ? displayHistory
    : (activeCollection?.bookIds ?? []).map((bookId) => ({ bookId }));

  const bookIds = useMemo(() => displayBooks.map(({ bookId }) => bookId), [displayBooks]);
  const sortMetaMap = useBookshelfSortMeta(bookIds, sortBy);
  const sortedDisplayBooks = useMemo(
    () => sortBookshelfItems(displayBooks, sortBy, sortMetaMap, sortDirection),
    [displayBooks, sortBy, sortMetaMap, sortDirection]
  );

  const goToCatalog = useCallback((bookId) => navigate(buildCatalogUrl(bookId)), [navigate]);

  const handleViewModeChange = (mode) => {
    setViewModeState(mode);
    setBookshelfViewMode(mode);
  };

  const handleSortChange = (next) => {
    setSortByState(next);
    setBookshelfSort(next);
    if (next !== 'manual') setReorderMode(false);
  };

  const handleSortDirectionToggle = () => {
    const next = sortDirection === 'desc' ? 'asc' : 'desc';
    setSortDirectionState(next);
    setBookshelfSortDirection(next);
  };

  const handleHistoryReorder = useCallback(async (fromIndex, toIndex) => {
    const scrollY = window.scrollY;
    await reorderReadingHistory(fromIndex, toIndex);
    const history = await getReadingHistory();
    flushSync(() => {
      setReadingHistory(history);
      setRenderTick((k) => k + 1);
    });
    window.scrollTo(0, scrollY);
  }, []);

  const closeConfirmDialog = () => setConfirmDialog(null);

  const handleConfirmDialog = async () => {
    if (!confirmDialog) return;
    try {
      await confirmDialog.onConfirm();
      setConfirmDialog(null);
    } catch (err) {
      showToast(formatErrorMessage(err, confirmDialog.errorMessage ?? '操作失敗，請稍後再試。'));
    }
  };

  const handleDeleteBook = (e, bookId, bookInfo) => {
    e.stopPropagation();
    const bookName = bookInfo?.book_info?.original_book_name;
    const convertedName = maybeConvert(bookName, conversionMode) || bookId;
    setConfirmDialog({
      title: '刪除書籍',
      message: (
        <ModalText>
          確定要刪除「<strong>{convertedName}</strong>」的所有本地資料嗎？此操作無法復原。
        </ModalText>
      ),
      confirmLabel: '刪除',
      errorMessage: '刪除書籍失敗，請稍後再試。',
      onConfirm: async () => {
        await deleteBookData(bookId);
        setRefreshKey((k) => k + 1);
      },
    });
  };

  const handleRemoveFromCollection = (e, bookId, bookInfo) => {
    e.stopPropagation();
    if (!activeCollection) return;
    const bookName = bookInfo?.book_info?.original_book_name;
    const convertedName = maybeConvert(bookName, conversionMode) || bookId;
    setConfirmDialog({
      title: '移除書籍',
      message: (
        <ModalText>
          確定要從「<strong>{activeCollection.name}</strong>」移除「<strong>{convertedName}</strong>」嗎？
        </ModalText>
      ),
      confirmLabel: '移除',
      errorMessage: '移除書籍失敗，請稍後再試。',
      onConfirm: async () => {
        await removeBookFromCollection(activeTab, bookId);
        await reloadDataKeepingScroll();
      },
    });
  };

  const handleAddToCollection = useCallback((bookId) => {
    setAddToCollectionBookId(bookId);
    setNewCollectionName('');
  }, []);

  const handleToggleBookInCollection = async (collectionId, bookId) => {
    const col = collections.find((c) => c.id === collectionId);
    if (!col) return;
    if (col.bookIds.includes(String(bookId))) {
      await removeBookFromCollection(collectionId, bookId);
    } else {
      await addBookToCollection(collectionId, bookId);
    }
    await reloadDataKeepingScroll();
  };

  const handleCreateCollectionFromModal = async () => {
    if (!newCollectionName.trim()) return;
    await createCollection(newCollectionName.trim());
    await reloadDataKeepingScroll();
    setNewCollectionName('');
  };

  const handleCreateNewTab = async () => {
    if (!newTabName.trim()) return;
    const col = await createCollection(newTabName.trim());
    await reloadData();
    setNewTabName('');
    setShowNewTabInput(false);
    if (col) setActiveTab(col.id);
  };

  const handleDeleteTab = () => {
    if (!activeCollection) return;
    setConfirmDialog({
      title: '刪除收藏夾',
      message: (
        <ModalText>
          確定要刪除收藏夾「<strong>{activeCollection.name}</strong>」嗎？
        </ModalText>
      ),
      confirmLabel: '刪除',
      errorMessage: '刪除收藏夾失敗，請稍後再試。',
      onConfirm: async () => {
        await deleteCollection(activeTab);
        await reloadData();
        setActiveTab(ALL_TAB);
        setEditingTab(false);
      },
    });
  };

  const handleStartRenameTab = () => {
    if (!activeCollection) return;
    setEditingTabName(activeCollection.name);
    setEditingTab(true);
    setTimeout(() => renameInputRef.current?.focus(), 0);
  };

  const handleConfirmRenameTab = async () => {
    if (activeTab !== ALL_TAB) {
      await renameCollection(activeTab, editingTabName);
      await reloadData();
    }
    setEditingTab(false);
    setEditingTabName('');
  };

  useEffect(() => {
    if (showNewTabInput) {
      setTimeout(() => newTabInputRef.current?.focus(), 0);
    }
  }, [showNewTabInput]);

  useEffect(() => {
    if (activeTab !== ALL_TAB && !collections.find((c) => c.id === activeTab)) {
      setActiveTab(ALL_TAB);
    }
  }, [activeTab, collections]);

  useEffect(() => {
    if (activeTab !== ALL_TAB || isSampleOnly || sortBy !== 'manual') {
      setReorderMode(false);
    }
  }, [activeTab, isSampleOnly, sortBy]);

  const canReorder = activeTab === ALL_TAB && !isSampleOnly && sortBy === 'manual';

  const renderBooks = () => {
    if (sortedDisplayBooks.length === 0) {
      return (
        <EmptyHint>
          {activeTab === ALL_TAB
            ? '尚無閱讀歷史'
            : '此收藏夾尚無書籍，可從「全部」分頁將書籍加入收藏'}
        </EmptyHint>
      );
    }

    const isAllTab = activeTab === ALL_TAB;

    const bookCardProps = (bookId) => ({
      bookId,
      onClick: () => goToCatalog(bookId),
      onDeleteClick: isAllTab ? handleDeleteBook : handleRemoveFromCollection,
      onAddToCollection: isAllTab && !isSampleOnly ? handleAddToCollection : undefined,
      conversionMode,
      sortBy,
      settingsMode,
    });

    if (viewMode === 'list') {
      if (canReorder && reorderMode) {
        return (
          <SortableBooks
            key={`list-${activeTab}-${renderTick}`}
            layout="list"
            items={sortedDisplayBooks}
            getKey={({ bookId }) => bookId}
            onReorder={handleHistoryReorder}
            renderItem={({ bookId }, sortable) => (
              <BookCard
                {...bookCardProps(bookId)}
                dragHandleProps={sortable.dragHandleProps}
                isDragging={sortable.isDragging}
                canClick={sortable.canClick}
                reorderMode={sortable.reorderMode}
              />
            )}
          />
        );
      }

      return (
        <ListLayout key={`list-${activeTab}-${renderTick}`}>
          {sortedDisplayBooks.map(({ bookId }) => (
            <BookCard key={bookId} {...bookCardProps(bookId)} />
          ))}
        </ListLayout>
      );
    }

    if (canReorder && reorderMode) {
      return (
        <SortableBooks
          key={`grid-${activeTab}-${renderTick}`}
          layout="grid"
          items={sortedDisplayBooks}
          getKey={({ bookId }) => bookId}
          onReorder={handleHistoryReorder}
          renderItem={({ bookId }, sortable) => (
            <GridCard
              {...bookCardProps(bookId)}
              dragHandleProps={sortable.dragHandleProps}
              isDragging={sortable.isDragging}
              canClick={sortable.canClick}
              reorderMode={sortable.reorderMode}
            />
          )}
        />
      );
    }

    return (
      <GridLayout key={`grid-${activeTab}-${renderTick}`}>
        {sortedDisplayBooks.map(({ bookId }) => (
          <GridCard key={bookId} {...bookCardProps(bookId)} />
        ))}
      </GridLayout>
    );
  };

  return (
    <Wrapper key={refreshKey}>
      {!dataLoaded ? (
        <EmptyHint>載入中…</EmptyHint>
      ) : (
        <>
      {showNewTabInput ? (
        <NewTabRow>
          <NewTabInput
            ref={newTabInputRef}
            value={newTabName}
            onChange={(e) => setNewTabName(e.target.value)}
            placeholder="收藏夾名稱"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateNewTab();
              if (e.key === 'Escape') { setShowNewTabInput(false); setNewTabName(''); }
            }}
          />
          <SmallIconBtn $variant="confirm" onClick={handleCreateNewTab} title="建立">
            <Check />
          </SmallIconBtn>
          <SmallIconBtn onClick={() => { setShowNewTabInput(false); setNewTabName(''); }} title="取消" $variant="cancel">
            <X />
          </SmallIconBtn>
        </NewTabRow>
      ) : (
        <TabBar>
          <Tab $active={activeTab === ALL_TAB} onClick={() => setActiveTab(ALL_TAB)}>
            全部
          </Tab>
          {collections.map((col) => (
            <Tab
              key={col.id}
              $active={activeTab === col.id}
              onClick={() => setActiveTab(col.id)}
              title={col.name}
            >
              {col.name}
            </Tab>
          ))}
          <AddTabBtn onClick={() => setShowNewTabInput(true)} title="新增收藏夾">
            <FolderPlus />
          </AddTabBtn>
        </TabBar>
      )}

      <TabActions>
        {activeCollection && (
          editingTab ? (
            <RenameRow>
              <RenameInput
                ref={renameInputRef}
                value={editingTabName}
                onChange={(e) => setEditingTabName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmRenameTab();
                  if (e.key === 'Escape') setEditingTab(false);
                }}
              />
              <TabActionGroup>
                <SmallIconBtn $variant="confirm" onClick={handleConfirmRenameTab} title="確認">
                  <Check />
                </SmallIconBtn>
                <SmallIconBtn $variant="cancel" onClick={() => setEditingTab(false)} title="取消">
                  <X />
                </SmallIconBtn>
              </TabActionGroup>
            </RenameRow>
          ) : (
            <TabActionGroup>
              <SmallIconBtn onClick={handleStartRenameTab} title="重新命名">
                <Edit2 />
              </SmallIconBtn>
              <SmallIconBtn $variant="delete" onClick={handleDeleteTab} title="刪除收藏夾">
                <Trash2 />
              </SmallIconBtn>
            </TabActionGroup>
          )
        )}
        <ToolbarRight>
          <SortUnit>
            <SelectDropdown
              options={BOOKSHELF_SORT_OPTIONS}
              value={sortBy}
              onChange={handleSortChange}
              ariaLabel="書架排序方式"
              attachedLabel="排序"
              embedded
              hasTrailing={sortBy !== 'manual' || canReorder}
              menuAlign="left"
              triggerMinWidth={108}
              triggerBold
            />
            {sortBy !== 'manual' ? (
              <SortTrailingBtn
                type="button"
                onClick={handleSortDirectionToggle}
                title={sortDirection === 'desc' ? '由高到低（點擊切換）' : '由低到高（點擊切換）'}
                aria-label={sortDirection === 'desc' ? '降序排列' : '升序排列'}
              >
                {sortDirection === 'desc' ? <ArrowDown /> : <ArrowUp />}
                {sortDirection === 'desc' ? '降序' : '升序'}
              </SortTrailingBtn>
            ) : canReorder ? (
              <SortTrailingBtn
                type="button"
                $active={reorderMode}
                onClick={() => setReorderMode((v) => !v)}
                title="調整排序"
                aria-label="調整排序"
                aria-pressed={reorderMode}
              >
                <ArrowUpDown />
                調序
              </SortTrailingBtn>
            ) : null}
          </SortUnit>
          <ViewToggle>
            <ToggleBtn
              $active={settingsMode}
              onClick={() => setSettingsMode((v) => !v)}
              title="管理書籍"
              aria-label="管理書籍"
              aria-pressed={settingsMode}
            >
              <Settings /> 管理
            </ToggleBtn>
          </ViewToggle>
          <ViewToggle>
            <ToggleBtn
              type="button"
              onClick={() => navigate(ROUTES.newBook)}
              title="新增書籍"
              aria-label="新增書籍"
            >
              <BookPlus /> 新書
            </ToggleBtn>
          </ViewToggle>
          <ViewToggle>
            <ToggleBtn
              $active={viewMode === 'list'}
              onClick={() => handleViewModeChange('list')}
              title="列表視圖"
            >
              <LayoutList /> 列表
            </ToggleBtn>
            <ToggleBtn
              $active={viewMode === 'grid'}
              onClick={() => handleViewModeChange('grid')}
              title="格狀視圖"
            >
              <Grid2X2 /> 格狀
            </ToggleBtn>
          </ViewToggle>
        </ToolbarRight>
      </TabActions>

      {reorderMode && canReorder && (
      <ReorderHint>拖曳書籍左上角的握把以調整順序，完成後再次點擊「調序」退出</ReorderHint>
      )}

      {settingsMode && !reorderMode && (
        <ReorderHint>書籍上已顯示管理按鈕，可加入收藏夾、刷新或刪除，完成後再次點擊「管理」退出</ReorderHint>
      )}

      {renderBooks()}

      {addToCollectionBookId && (
        <CollectionModal
          bookId={addToCollectionBookId}
          collections={collections}
          newCollectionName={newCollectionName}
          onNewCollectionNameChange={setNewCollectionName}
          onClose={() => setAddToCollectionBookId(null)}
          onToggleBook={handleToggleBookInCollection}
          onCreateCollection={handleCreateCollectionFromModal}
        />
      )}

      {confirmDialog && (
        <ConfirmModal
          title={confirmDialog.title}
          message={confirmDialog.message}
          confirmLabel={confirmDialog.confirmLabel}
          onConfirm={handleConfirmDialog}
          onCancel={closeConfirmDialog}
        />
      )}
        </>
      )}
    </Wrapper>
  );
}

export default Content;
