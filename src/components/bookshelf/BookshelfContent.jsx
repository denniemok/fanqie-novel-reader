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
  Trash2,
  X,
  Check,
  Edit2,
  Settings,
} from 'lucide-react';
import BookCard from '../home/BookCard';
import GridCard from './GridCard';
import SortableBooks from './SortableBooks';
import { useToast } from '../../contexts/ToastContext';
import { maybeConvert } from '../../utils/zh-convert';
import { buildCatalogUrl } from '../../utils/navigation';
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding-top: calc(100px + env(safe-area-inset-top));
  padding-left: 24px;
  padding-right: 24px;
  padding-bottom: calc(40px + env(safe-area-inset-bottom));
  max-width: 800px;
  margin: 0 auto;
  gap: 20px;

  @media (max-width: 480px) {
    padding-top: calc(88px + env(safe-area-inset-top));
    padding-left: 16px;
    padding-right: 16px;
    padding-bottom: calc(24px + env(safe-area-inset-bottom));
  }
`;

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
  padding: 10px 16px;
  background: ${(p) => (p.$active ? 'var(--accent-color)' : 'var(--background-color2)')};
  color: ${(p) => (p.$active ? '#000' : 'var(--text-color-secondary)')};
  border: none;
  border-right: 1px solid var(--border-color);
  font-size: 13px;
  font-weight: 900;
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.1s steps(2);
  white-space: nowrap;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: ${(p) => (p.$active ? 'var(--accent-hover)' : 'var(--hover-background-color)')};
    color: ${(p) => (p.$active ? '#000' : 'var(--text-color)')};
  }
`;

const AddTabBtn = styled.button`
  flex-shrink: 0;
  padding: 10px 14px;
  background: var(--background-color2);
  color: var(--text-color-secondary);
  border: none;
  border-right: 1px solid var(--border-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.1s steps(2);

  svg {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: var(--hover-background-color);
    color: var(--accent-color);
  }
`;

const NewTabRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const NewTabInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  background: var(--background-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  font-size: 14px;
  font-family: inherit;
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
  padding: 6px;
  border: 1px solid var(--border-color);
  background: ${(p) =>
    p.$variant === 'delete' ? '#aa5555' : p.$variant === 'confirm' ? '#55aa55' : 'var(--background-color2)'};
  color: ${(p) => (p.$variant ? '#000' : 'var(--text-color)')};
  cursor: pointer;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: all 0.1s steps(2);

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    filter: brightness(1.2);
  }
`;

const TabActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const TabActionGroup = styled.div`
  display: flex;
  gap: 4px;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 0;
  border: 1px solid var(--border-color);
  overflow: hidden;
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  flex-wrap: wrap;
`;

const SortWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: var(--text-color-secondary);
  white-space: nowrap;
`;

const SortControl = styled.div`
  display: flex;
  align-items: stretch;
  border: 1px solid var(--border-color);
  overflow: hidden;
`;

const SortSelect = styled.select`
  padding: 6px 10px;
  background: var(--background-color2);
  color: var(--text-color);
  border: none;
  border-right: ${(p) => (p.$hasTrailingBtn ? '1px solid var(--border-color)' : 'none')};
  font-size: 12px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  max-width: 120px;

  &:focus {
    outline: none;
  }
`;

const SortTrailingBtn = styled.button`
  padding: 6px 8px;
  background: ${(p) => (p.$active ? 'var(--accent-color)' : 'var(--background-color2)')};
  color: ${(p) => (p.$active ? '#000' : 'var(--accent-color)')};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.1s steps(2);

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    background: ${(p) => (p.$active ? 'var(--accent-hover)' : 'var(--hover-background-color)')};
  }
`;

const ReorderHint = styled.div`
  font-size: 12px;
  color: var(--accent-color);
  padding: 6px 10px;
  border: 1px dashed var(--accent-color);
  background: rgba(212, 165, 116, 0.08);
  width: 100%;
  text-align: center;
`;

const ToggleBtn = styled.button`
  padding: 6px 10px;
  background: ${(p) => (p.$active ? 'var(--accent-color)' : 'var(--background-color2)')};
  color: ${(p) => (p.$active ? '#000' : 'var(--text-color-secondary)')};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
  transition: all 0.1s steps(2);

  svg {
    width: 14px;
    height: 14px;
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

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
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
  padding: 6px 10px;
  background: var(--background-color);
  border: 1px solid var(--accent-color);
  color: var(--text-color);
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  outline: none;
`;

// ── Add to Collection Modal ───────────────────────────────────────────────────

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const ModalBox = styled.div`
  background: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  box-shadow: var(--retro-shadow);
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalTitle = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 12px 16px;
  background: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 320px;
  overflow-y: auto;
`;

const CollectionOption = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: ${(p) => (p.$checked ? 'rgba(212, 165, 116, 0.15)' : 'var(--background-color)')};
  border: 1px solid ${(p) => (p.$checked ? 'var(--accent-color)' : 'var(--border-color)')};
  color: var(--text-color);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  text-align: left;
  transition: all 0.1s steps(2);

  &:hover {
    border-color: var(--accent-color);
    background: var(--hover-background-color);
  }

  .check {
    width: 16px;
    height: 16px;
    color: var(--accent-color);
    flex-shrink: 0;
  }
`;

const ModalCreateRow = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--border-color);
`;

const ModalInput = styled.input`
  flex: 1;
  padding: 8px 10px;
  background: var(--background-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  font-size: 13px;
  font-family: inherit;
  outline: none;

  &:focus {
    border-color: var(--accent-color);
  }

  &::placeholder {
    color: var(--text-color-secondary);
    opacity: 0.5;
  }
`;

const ModalCreateBtn = styled.button`
  padding: 8px 12px;
  background: var(--accent-color);
  color: #000;
  border: 2px solid #000;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 2px 2px 0px #000;
  transition: all 0.1s steps(2);
  text-transform: uppercase;
  font-family: inherit;

  &:hover {
    background: var(--accent-hover);
    transform: translate(-1px, -1px);
    box-shadow: 3px 3px 0px #000;
  }
`;

// ── Main component ────────────────────────────────────────────────────────────

function BookshelfContent({ conversionMode = 'tw' }) {
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
  const newTabInputRef = useRef(null);
  const renameInputRef = useRef(null);

  const reloadData = useCallback(async () => {
    const [history, cols] = await Promise.all([getReadingHistory(), getCollections()]);
    setReadingHistory(history);
    setCollections(cols);
    setDataLoaded(true);
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

  const handleSortChange = (e) => {
    const next = e.target.value;
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

  const handleDeleteBook = async (e, bookId, bookInfo) => {
    e.stopPropagation();
    const bookName = bookInfo?.book_info?.original_book_name;
    const convertedName = maybeConvert(bookName, conversionMode) || bookId;
    if (window.confirm(`確定要刪除「${convertedName}」的所有本地資料嗎？`)) {
      try {
        await deleteBookData(bookId);
        setRefreshKey((k) => k + 1);
      } catch (err) {
        showToast(formatErrorMessage(err, '刪除書籍失敗，請稍後再試。'));
      }
    }
  };

  const handleRemoveFromCollection = async (e, bookId, bookInfo) => {
    e.stopPropagation();
    if (!activeCollection) return;
    const bookName = bookInfo?.book_info?.original_book_name;
    const convertedName = maybeConvert(bookName, conversionMode) || bookId;
    if (window.confirm(`確定要從「${activeCollection.name}」移除「${convertedName}」嗎？`)) {
      await removeBookFromCollection(activeTab, bookId);
      await reloadData();
      setRenderTick((k) => k + 1);
    }
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
    await reloadData();
    setRenderTick((k) => k + 1);
  };

  const handleCreateCollectionFromModal = async () => {
    if (!newCollectionName.trim()) return;
    await createCollection(newCollectionName.trim());
    await reloadData();
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

  const handleDeleteTab = async () => {
    if (!activeCollection) return;
    if (!window.confirm(`確定要刪除收藏夾「${activeCollection.name}」嗎？`)) return;
    await deleteCollection(activeTab);
    await reloadData();
    setActiveTab(ALL_TAB);
    setEditingTab(false);
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
          <SmallIconBtn onClick={() => { setShowNewTabInput(false); setNewTabName(''); }} title="取消">
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
            <Plus />
          </AddTabBtn>
        </TabBar>
      )}

      <TabActions>
        {activeCollection && (
          editingTab ? (
            <>
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
                <SmallIconBtn onClick={() => setEditingTab(false)} title="取消">
                  <X />
                </SmallIconBtn>
              </TabActionGroup>
            </>
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
          <SortWrapper>
            排序
            <SortControl>
              <SortSelect
                value={sortBy}
                onChange={handleSortChange}
                aria-label="書架排序方式"
                $hasTrailingBtn={sortBy !== 'manual' ? true : canReorder}
              >
                {BOOKSHELF_SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </SortSelect>
              {sortBy !== 'manual' ? (
                <SortTrailingBtn
                  type="button"
                  onClick={handleSortDirectionToggle}
                  title={sortDirection === 'desc' ? '由高到低（點擊切換）' : '由低到高（點擊切換）'}
                  aria-label={sortDirection === 'desc' ? '降序排列' : '升序排列'}
                >
                  {sortDirection === 'desc' ? <ArrowDown /> : <ArrowUp />}
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
                </SortTrailingBtn>
              ) : null}
            </SortControl>
          </SortWrapper>
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
        <ReorderHint>拖曳書籍左上角的握把以調整順序，完成後再次點擊退出</ReorderHint>
      )}

      {settingsMode && !reorderMode && (
        <ReorderHint>書籍上已顯示管理按鈕，可加入收藏夾、刷新或刪除，完成後再次點擊退出</ReorderHint>
      )}

      {renderBooks()}

      {addToCollectionBookId && (
        <ModalOverlay onClick={() => setAddToCollectionBookId(null)}>
          <ModalBox onClick={(e) => e.stopPropagation()}>
            <ModalTitle>
              加入收藏夾
              <SmallIconBtn onClick={() => setAddToCollectionBookId(null)}>
                <X />
              </SmallIconBtn>
            </ModalTitle>
            <ModalBody>
              {collections.length === 0 ? (
                <EmptyHint>尚無收藏夾，請先建立一個</EmptyHint>
              ) : (
                collections.map((col) => {
                  const checked = col.bookIds.includes(String(addToCollectionBookId));
                  return (
                    <CollectionOption
                      key={col.id}
                      $checked={checked}
                      onClick={() => handleToggleBookInCollection(col.id, addToCollectionBookId)}
                    >
                      {col.name}
                      {checked && <Check className="check" />}
                    </CollectionOption>
                  );
                })
              )}
            </ModalBody>
            <ModalCreateRow>
              <ModalInput
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="新增收藏夾…"
                onKeyDown={(e) => { if (e.key === 'Enter') handleCreateCollectionFromModal(); }}
              />
              <ModalCreateBtn onClick={handleCreateCollectionFromModal}>建立</ModalCreateBtn>
            </ModalCreateRow>
          </ModalBox>
        </ModalOverlay>
      )}
        </>
      )}
    </Wrapper>
  );
}

export default BookshelfContent;
