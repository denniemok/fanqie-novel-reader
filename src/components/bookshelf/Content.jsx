import { useState, useCallback, useEffect, useMemo } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import CollectionModal from './CollectionModal';
import CollectionManagementModal from './CollectionManagementModal';
import ConfirmModal from '../common/ConfirmModal';
import EmptyHint from '../common/EmptyHint';
import BookshelfToolbar from './BookshelfToolbar';
import BookshelfBookList from './BookshelfBookList';
import ManageActionBar from './ManageActionBar';
import { ModalText } from '../common/ModalBase';
import { useToast } from '../../contexts/ToastContext';
import { useDownloadManager } from '../../contexts/DownloadManager';
import { buildCatalogUrl, ROUTES } from '../../utils/navigation';
import { formatErrorMessage } from '../../utils/errors';
import { fetchBookDetailAndDirectory, getCachedOrFetchDirectory } from '../../utils/api-helpers';
import {
  getReadingHistory,
  deleteBooksData,
  reorderReadingHistory,
  getBookshelfViewMode,
  setBookshelfViewMode,
  getBookshelfSort,
  setBookshelfSort,
  getBookshelfSortDirection,
  setBookshelfSortDirection,
  getBookshelfActiveTab,
  setBookshelfActiveTab,
  getBookshelfFilterState,
  setBookshelfFilterState,
  getCollections,
  createCollection,
  deleteCollection,
  renameCollection,
  addBooksToCollection,
  removeBooksFromCollection,
  reorderCollectionBooks,
  reorderCollections,
  getUncachedItemIds,
} from '../../utils/storage';
import { sortBookshelfItems } from '../../utils/bookshelfSort';
import { maybeConvert } from '../../utils/zh-convert';
import { resolveBookDisplay } from '../../utils/bookInfo';
import { useBookDisplayVariant } from '../../contexts/BookDisplayVariantContext';
import { useBookshelfSortMeta } from '../../hooks/useBookshelfSortMeta';
import { useBookshelfSearchMeta, bookMatchesBookshelfSearch } from '../../hooks/useBookshelfSearchMeta';
import {
  bookMatchesFilters,
  collectCategoriesFromItems,
  hasActiveBookFilters,
} from '../../utils/bookFilters';
import { ALL_TAB } from './constants';
import { Wrapper, ReorderHint } from './styles';

// ── Main component ────────────────────────────────────────────────────────────

function Content({ conversionMode = 'tw' }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { startDownloadAll } = useDownloadManager();
  const { variant } = useBookDisplayVariant();

  const [activeTab, setActiveTab] = useState(getBookshelfActiveTab);
  const [viewMode, setViewModeState] = useState(getBookshelfViewMode);
  const [sortBy, setSortByState] = useState(getBookshelfSort);
  const [sortDirection, setSortDirectionState] = useState(getBookshelfSortDirection);
  const [refreshKey, setRefreshKey] = useState(0);
  const [renderTick, setRenderTick] = useState(0);
  const [readingHistory, setReadingHistory] = useState([]);
  const [collections, setCollections] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [addToCollectionBookIds, setAddToCollectionBookIds] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showCollectionManagement, setShowCollectionManagement] = useState(false);
  const initialFilterState = getBookshelfFilterState();
  const [searchQuery, setSearchQuery] = useState('');
  const [bookFilters, setBookFilters] = useState(initialFilterState.filters);
  const [filtersExpanded, setFiltersExpanded] = useState(initialFilterState.expanded);
  const [reorderMode, setReorderMode] = useState(false);
  const [settingsMode, setSettingsMode] = useState(false);
  const [selectedBookIds, setSelectedBookIds] = useState(() => new Set());
  const [refreshingBookIds, setRefreshingBookIds] = useState(() => new Set());
  const [bookDataVersions, setBookDataVersions] = useState({});
  const [bookRefreshErrors, setBookRefreshErrors] = useState({});
  const [confirmDialog, setConfirmDialog] = useState(null);

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

  const activeCollection = activeTab !== ALL_TAB
    ? collections.find((c) => c.id === activeTab)
    : null;

  const displayBooks = activeTab === ALL_TAB
    ? readingHistory
    : (activeCollection?.bookIds ?? []).map((bookId) => ({ bookId }));

  const bookIds = useMemo(() => displayBooks.map(({ bookId }) => bookId), [displayBooks]);
  const sortMetaMap = useBookshelfSortMeta(bookIds, sortBy);
  const sortedDisplayBooks = useMemo(
    () => sortBookshelfItems(displayBooks, sortBy, sortMetaMap, sortDirection),
    [displayBooks, sortBy, sortMetaMap, sortDirection]
  );

  const searchMetaRefreshKey = useMemo(
    () => bookIds.map((id) => bookDataVersions[id] || 0).join(','),
    [bookIds, bookDataVersions]
  );
  const searchMetaMap = useBookshelfSearchMeta(bookIds, searchMetaRefreshKey);

  const filterCategories = useMemo(
    () => collectCategoriesFromItems(displayBooks, ({ bookId }) => searchMetaMap[bookId]),
    [displayBooks, searchMetaMap]
  );

  const hasSearch = Boolean(searchQuery.trim());
  const hasActiveFilters = hasActiveBookFilters(bookFilters);
  const booksForDisplay = useMemo(() => {
    let result = sortedDisplayBooks;
    if (hasSearch) {
      result = result.filter(({ bookId }) =>
        bookMatchesBookshelfSearch(searchMetaMap[bookId], bookId, searchQuery, conversionMode)
      );
    }
    if (hasActiveFilters) {
      result = result.filter(({ bookId }) =>
        bookMatchesFilters(searchMetaMap[bookId], bookFilters)
      );
    }
    return result;
  }, [
    sortedDisplayBooks,
    searchQuery,
    searchMetaMap,
    conversionMode,
    hasSearch,
    hasActiveFilters,
    bookFilters,
  ]);

  const selectableBookIds = useMemo(
    () => booksForDisplay.map(({ bookId }) => bookId),
    [booksForDisplay]
  );

  const allBooksSelected = selectableBookIds.length > 0
    && selectableBookIds.every((bookId) => selectedBookIds.has(bookId));

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

  const handleReorderModeToggle = () => {
    setReorderMode((v) => {
      const next = !v;
      if (next) setSettingsMode(false);
      return next;
    });
  };

  const handleSettingsModeToggle = () => {
    if (!settingsMode) {
      setReorderMode(false);
    } else {
      setSelectedBookIds(new Set());
    }
    setSettingsMode((v) => !v);
  };

  const clearBookRefreshErrors = useCallback((bookIds) => {
    setBookRefreshErrors((prev) => {
      const ids = (Array.isArray(bookIds) ? bookIds : [bookIds]).map(String);
      if (ids.length === 0) return prev;
      const next = { ...prev };
      ids.forEach((bookId) => delete next[bookId]);
      return next;
    });
  }, []);

  const toggleBookSelection = useCallback((bookId) => {
    setSelectedBookIds((prev) => {
      const next = new Set(prev);
      if (next.has(bookId)) next.delete(bookId);
      else next.add(bookId);
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedBookIds(new Set(selectableBookIds));
  }, [selectableBookIds]);

  const handleDeselectAll = useCallback(() => {
    setSelectedBookIds(new Set());
  }, []);

  useEffect(() => {
    if (!settingsMode) {
      setSelectedBookIds(new Set());
      setRefreshingBookIds(new Set());
    }
  }, [settingsMode]);

  useEffect(() => {
    setSelectedBookIds(new Set());
    setSearchQuery('');
  }, [activeTab]);

  useEffect(() => {
    if (hasSearch || hasActiveFilters) setReorderMode(false);
  }, [hasSearch, hasActiveFilters]);

  useEffect(() => {
    setBookshelfFilterState({ filters: bookFilters, expanded: filtersExpanded });
  }, [bookFilters, filtersExpanded]);

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

  const handleCollectionReorder = useCallback(async (fromIndex, toIndex) => {
    const scrollY = window.scrollY;
    await reorderCollectionBooks(activeTab, fromIndex, toIndex);
    const cols = await getCollections();
    flushSync(() => {
      setCollections(cols);
      setRenderTick((k) => k + 1);
    });
    window.scrollTo(0, scrollY);
  }, [activeTab]);

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

  const handleAddToCollection = useCallback((bookIds) => {
    const ids = Array.isArray(bookIds) ? bookIds : [bookIds];
    setAddToCollectionBookIds(ids);
    setNewCollectionName('');
  }, []);

  const handleBookRefresh = useCallback(async (_e, bookId) => {
    if (refreshingBookIds.has(bookId)) return;
    setRefreshingBookIds((prev) => new Set(prev).add(bookId));
    setBookRefreshErrors((prev) => {
      const next = { ...prev };
      delete next[bookId];
      return next;
    });

    try {
      const { partialLoadMessage } = await fetchBookDetailAndDirectory(bookId, { forceRefresh: true });
      setBookDataVersions((prev) => ({
        ...prev,
        [bookId]: (prev[bookId] || 0) + 1,
      }));
      if (partialLoadMessage) {
        setBookRefreshErrors((prev) => ({ ...prev, [bookId]: partialLoadMessage }));
      }
    } catch (err) {
      setBookRefreshErrors((prev) => ({
        ...prev,
        [bookId]: formatErrorMessage(err, '刷新失敗，請稍後再試。'),
      }));
    } finally {
      setRefreshingBookIds((prev) => {
        const next = new Set(prev);
        next.delete(bookId);
        return next;
      });
    }
  }, [refreshingBookIds]);

  const handleDeleteBook = useCallback((e, bookId, bookInfo) => {
    e.stopPropagation();
    const { book_name: bookName } = resolveBookDisplay(bookInfo, variant, bookId);
    const convertedName = maybeConvert(bookName, conversionMode) || bookId;
    setConfirmDialog({
      title: '刪除書籍',
      message: (
        <ModalText>
          確定要刪除 <strong>{convertedName}</strong> 的所有本地資料嗎？此操作無法復原。
        </ModalText>
      ),
      confirmLabel: '刪除',
      errorMessage: '刪除書籍失敗，請稍後再試。',
      onConfirm: async () => {
        await deleteBooksData([bookId]);
        clearBookRefreshErrors(bookId);
        setRefreshKey((k) => k + 1);
      },
    });
  }, [conversionMode, variant, clearBookRefreshErrors]);

  const handleRemoveFromCollection = useCallback((e, bookId, bookInfo) => {
    e.stopPropagation();
    if (!activeCollection) return;
    const { book_name: bookName } = resolveBookDisplay(bookInfo, variant, bookId);
    const convertedName = maybeConvert(bookName, conversionMode) || bookId;
    setConfirmDialog({
      title: '移除書籍',
      message: (
        <ModalText>
          確定要從「<strong>{activeCollection.name}</strong>」移除 <strong>{convertedName}</strong> 嗎？
        </ModalText>
      ),
      confirmLabel: '移除',
      errorMessage: '移除書籍失敗，請稍後再試。',
      onConfirm: async () => {
        await removeBooksFromCollection(activeTab, [bookId]);
        clearBookRefreshErrors(bookId);
        await reloadDataKeepingScroll();
      },
    });
  }, [activeCollection, activeTab, conversionMode, variant, clearBookRefreshErrors, reloadDataKeepingScroll]);

  const handleBookDelete = activeTab === ALL_TAB ? handleDeleteBook : handleRemoveFromCollection;

  const handleBulkAddToCollection = () => {
    if (selectedBookIds.size === 0) return;
    handleAddToCollection(Array.from(selectedBookIds));
  };

  const handleBookDownload = useCallback(async (bookId) => {
    try {
      const directory = await getCachedOrFetchDirectory(bookId);
      const list = directory?.item_data_list ?? [];
      if (!list.length) {
        showToast('無法取得章節目錄');
        return;
      }

      const uncachedItemIds = await getUncachedItemIds(list.map((item) => item.item_id));

      if (uncachedItemIds.length > 0) {
        startDownloadAll(bookId, uncachedItemIds);
      } else {
        showToast('所有章節已下載');
      }
      navigate(ROUTES.download);
    } catch (err) {
      showToast(formatErrorMessage(err, '無法開始下載，請稍後再試。'));
    }
  }, [navigate, showToast, startDownloadAll]);

  const handleGoToDownload = async () => {
    if (selectedBookIds.size !== 1) return;
    await handleBookDownload(Array.from(selectedBookIds)[0]);
  };

  const handleBulkRefresh = async () => {
    if (selectedBookIds.size === 0 || refreshingBookIds.size > 0) return;
    const ids = Array.from(selectedBookIds);
    setRefreshingBookIds(new Set(ids));
    setBookRefreshErrors((prev) => {
      const next = { ...prev };
      ids.forEach((bookId) => delete next[bookId]);
      return next;
    });

    const outcomes = await Promise.all(
      ids.map(async (bookId) => {
        try {
          const { partialLoadMessage } = await fetchBookDetailAndDirectory(bookId, { forceRefresh: true });
          setBookDataVersions((prev) => ({
            ...prev,
            [bookId]: (prev[bookId] || 0) + 1,
          }));
          if (partialLoadMessage) {
            setBookRefreshErrors((prev) => ({ ...prev, [bookId]: partialLoadMessage }));
          }
          return { bookId, ok: !partialLoadMessage, partialLoadMessage, error: null };
        } catch (err) {
          setBookRefreshErrors((prev) => ({
            ...prev,
            [bookId]: formatErrorMessage(err, '刷新失敗，請稍後再試。'),
          }));
          return { bookId, ok: false, partialLoadMessage: null, error: err };
        } finally {
          setRefreshingBookIds((prev) => {
            const next = new Set(prev);
            next.delete(bookId);
            return next;
          });
        }
      })
    );

    const succeeded = outcomes.filter((o) => o.ok).length;
    const failed = outcomes.length - succeeded;

    if (failed === 0) {
      showToast(`已刷新 ${ids.length} 本書籍`);
      return;
    }

    if (succeeded === 0) {
      showToast(`全部 ${failed} 本刷新失敗`);
    } else {
      showToast(`${succeeded} 本刷新成功，${failed} 本失敗`);
    }
  };

  const handleBulkDelete = () => {
    if (selectedBookIds.size === 0) return;
    const ids = Array.from(selectedBookIds);
    const isAllTab = activeTab === ALL_TAB;

    if (isAllTab) {
      setConfirmDialog({
        title: '刪除書籍',
        message: (
          <ModalText>
            確定要刪除已選的 <strong>{ids.length}</strong> 本書籍的所有本地資料嗎？此操作無法復原。
          </ModalText>
        ),
        confirmLabel: '刪除',
        errorMessage: '刪除書籍失敗，請稍後再試。',
        onConfirm: async () => {
          await deleteBooksData(ids);
          clearBookRefreshErrors(ids);
          setSelectedBookIds(new Set());
          setRefreshKey((k) => k + 1);
        },
      });
      return;
    }

    if (!activeCollection) return;
    setConfirmDialog({
      title: '移除書籍',
      message: (
        <ModalText>
          確定要從「<strong>{activeCollection.name}</strong>」移除已選的 <strong>{ids.length}</strong> 本書籍嗎？
        </ModalText>
      ),
      confirmLabel: '移除',
      errorMessage: '移除書籍失敗，請稍後再試。',
      onConfirm: async () => {
        await removeBooksFromCollection(activeTab, ids);
        clearBookRefreshErrors(ids);
        setSelectedBookIds(new Set());
        await reloadDataKeepingScroll();
      },
    });
  };

  const handleToggleBooksInCollection = async (collectionId, bookIds, shouldInclude) => {
    const ids = (Array.isArray(bookIds) ? bookIds : [bookIds]).map(String);

    if (shouldInclude) {
      await addBooksToCollection(collectionId, ids);
    } else {
      await removeBooksFromCollection(collectionId, ids);
    }
    await reloadDataKeepingScroll();
  };

  const handleCreateCollectionFromModal = async () => {
    if (!newCollectionName.trim()) return;
    await createCollection(newCollectionName.trim());
    await reloadDataKeepingScroll();
    setNewCollectionName('');
  };

  const handleCreateCollectionInManagement = async (name) => {
    await createCollection(name);
    await reloadData();
  };

  const handleRenameCollectionInManagement = async (collectionId, name) => {
    await renameCollection(collectionId, name);
    await reloadData();
  };

  const handleDeleteCollectionInManagement = async (collectionId) => {
    await deleteCollection(collectionId);
    await reloadData();
    if (activeTab === collectionId) setActiveTab(ALL_TAB);
  };

  const handleCollectionsReorder = useCallback(async (fromIndex, toIndex) => {
    await reorderCollections(fromIndex, toIndex);
    const cols = await getCollections();
    setCollections(cols);
  }, []);

  useEffect(() => {
    if (!dataLoaded) return;
    if (activeTab !== ALL_TAB && !collections.find((c) => c.id === activeTab)) {
      setActiveTab(ALL_TAB);
    }
  }, [activeTab, collections, dataLoaded]);

  useEffect(() => {
    setBookshelfActiveTab(activeTab);
  }, [activeTab]);

  const canReorder = sortBy === 'manual' && (activeTab !== ALL_TAB || readingHistory.length > 0);

  useEffect(() => {
    if (!canReorder) setReorderMode(false);
  }, [canReorder]);

  const handleReorder = activeTab === ALL_TAB ? handleHistoryReorder : handleCollectionReorder;
  const manageBarVisible = settingsMode && !reorderMode;

  return (
    <Wrapper
      key={refreshKey}
      $gap={24}
      $paddingBottom={manageBarVisible ? 88 : undefined}
      $paddingBottomMobile={manageBarVisible ? 80 : undefined}
    >
      {!dataLoaded ? (
        <EmptyHint>載入中…</EmptyHint>
      ) : (
        <>
          <BookshelfToolbar
            activeTab={activeTab}
            onActiveTabChange={setActiveTab}
            readingHistory={readingHistory}
            collections={collections}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onOpenCollectionManagement={() => setShowCollectionManagement(true)}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            sortDirection={sortDirection}
            onSortDirectionToggle={handleSortDirectionToggle}
            canReorder={canReorder}
            reorderMode={reorderMode}
            hasSearch={hasSearch}
            hasActiveFilters={hasActiveFilters}
            onReorderModeToggle={handleReorderModeToggle}
            settingsMode={settingsMode}
            onSettingsModeToggle={handleSettingsModeToggle}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            navigate={navigate}
            filterCategories={filterCategories}
            bookFilters={bookFilters}
            onBookFiltersChange={setBookFilters}
            filtersExpanded={filtersExpanded}
            onFiltersExpandedChange={setFiltersExpanded}
            conversionMode={conversionMode}
          />

          {reorderMode && canReorder && (
            <ReorderHint>
              {viewMode === 'grid'
                ? '拖曳書籍頂部的握把以調整順序，完成後再次點擊「調序」退出'
                : '拖曳書籍左側的握把以調整順序，完成後再次點擊「調序」退出'}
            </ReorderHint>
          )}

          {settingsMode && !reorderMode && (
            <ReorderHint>點擊書籍以選取，使用底部工具列進行管理，完成後再次點擊「管理」退出</ReorderHint>
          )}

          <BookshelfBookList
            activeTab={activeTab}
            sortedDisplayBooks={sortedDisplayBooks}
            booksForDisplay={booksForDisplay}
            viewMode={viewMode}
            canReorder={canReorder}
            reorderMode={reorderMode}
            settingsMode={settingsMode}
            conversionMode={conversionMode}
            sortBy={sortBy}
            selectedBookIds={selectedBookIds}
            refreshingBookIds={refreshingBookIds}
            bookRefreshErrors={bookRefreshErrors}
            bookDataVersions={bookDataVersions}
            renderTick={renderTick}
            onBookClick={goToCatalog}
            onToggleBookSelection={toggleBookSelection}
            onReorder={handleReorder}
            onBookRefresh={handleBookRefresh}
            onBookDelete={handleBookDelete}
            onBookAddToCollection={handleAddToCollection}
            onBookDownload={handleBookDownload}
          />

          {manageBarVisible && (
            <ManageActionBar
              activeTab={activeTab}
              selectedCount={selectedBookIds.size}
              allBooksSelected={allBooksSelected}
              selectableBookIds={selectableBookIds}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onBulkAddToCollection={handleBulkAddToCollection}
              onGoToDownload={handleGoToDownload}
              onBulkRefresh={handleBulkRefresh}
              onBulkDelete={handleBulkDelete}
              isRefreshing={refreshingBookIds.size > 0}
            />
          )}

          {showCollectionManagement && (
            <CollectionManagementModal
              collections={collections}
              activeTab={activeTab}
              onClose={() => setShowCollectionManagement(false)}
              onCreateCollection={handleCreateCollectionInManagement}
              onRenameCollection={handleRenameCollectionInManagement}
              onDeleteCollection={handleDeleteCollectionInManagement}
              onReorderCollections={handleCollectionsReorder}
            />
          )}

          {addToCollectionBookIds && (
            <CollectionModal
              bookIds={addToCollectionBookIds}
              collections={collections}
              newCollectionName={newCollectionName}
              onNewCollectionNameChange={setNewCollectionName}
              onClose={() => setAddToCollectionBookIds(null)}
              onToggleBooks={handleToggleBooksInCollection}
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
