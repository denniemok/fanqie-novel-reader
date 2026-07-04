import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyHint from '../ui/EmptyHint';
import BookshelfToolbar from './BookshelfToolbar';
import BookshelfBookList from './BookshelfBookList';
import BookshelfManageActionBar from './BookshelfManageActionBar';
import BookshelfModals from './BookshelfModals';
import { ModalText } from '../ui/ModalBase';
import { useToast } from '../../contexts/ToastContext';
import { useDownloadManager } from '../../contexts/DownloadManager';
import { useBookRefresh } from '../../hooks/book/useBookRefresh';
import { buildCatalogUrl, ROUTES } from '../../utils/navigation';
import { formatErrorMessage } from '../../utils/errors';
import { startDownloadAllForBookSafe } from '../../utils/export/startDownloadAllForBook';
import { scrollPreservingUpdate } from '../../utils/scrollPreservingUpdate';
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
} from '../../utils/storage';
import { sortBookshelfItems } from '../../utils/book/bookListSort';
import { maybeConvert } from '../../utils/text/zh-convert';
import { resolveBookDisplay } from '../../utils/book/bookInfo';
import { useBookDisplayVariant } from '../../contexts/BookDisplayVariantContext';
import { useBookshelfSortMeta } from '../../hooks/bookshelf/useBookshelfSortMeta';
import { useBookshelfSearchMeta, bookMatchesBookshelfSearch } from '../../hooks/bookshelf/useBookshelfSearchMeta';
import {
  bookMatchesFilters,
  collectCategoriesFromItems,
  hasActiveBookFilters,
} from '../../utils/book/bookFilters';
import { ALL_TAB } from './constants';
import { Wrapper, ReorderHint } from './styles';

// ── Main component ────────────────────────────────────────────────────────────

function BookshelfContent({ conversionMode = 'tw' }) {
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
  const [manageMode, setManageMode] = useState(false);
  const [selectedBookIds, setSelectedBookIds] = useState(() => new Set());
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [exportBookId, setExportBookId] = useState(null);

  const {
    refreshingBookIds,
    bookDataVersions,
    bookRefreshErrors,
    clearBookRefreshErrors,
    handleBookRefresh,
    handleBulkRefresh,
    resetRefreshingOnManageExit,
  } = useBookRefresh();

  const reloadData = useCallback(async () => {
    const [history, cols] = await Promise.all([getReadingHistory(), getCollections()]);
    setReadingHistory(history);
    setCollections(cols);
    setDataLoaded(true);
  }, []);

  const reloadDataKeepingScroll = useCallback(async () => {
    await scrollPreservingUpdate(
      () => Promise.all([getReadingHistory(), getCollections()]),
      ([history, cols]) => {
        setReadingHistory(history);
        setCollections(cols);
        setDataLoaded(true);
      },
    );
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

  const filterBaseItems = useMemo(() => {
    if (!hasSearch) return sortedDisplayBooks;
    return sortedDisplayBooks.filter(({ bookId }) =>
      bookMatchesBookshelfSearch(searchMetaMap[bookId], bookId, searchQuery, conversionMode)
    );
  }, [sortedDisplayBooks, hasSearch, searchMetaMap, searchQuery, conversionMode]);

  const getFilterMeta = useCallback(
    ({ bookId }) => searchMetaMap[bookId],
    [searchMetaMap]
  );

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
      if (next) setManageMode(false);
      return next;
    });
  };

  const handleManageModeToggle = () => {
    if (!manageMode) {
      setReorderMode(false);
    } else {
      setSelectedBookIds(new Set());
    }
    setManageMode((v) => !v);
  };

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
    if (!manageMode) {
      setSelectedBookIds(new Set());
      resetRefreshingOnManageExit();
    }
  }, [manageMode, resetRefreshingOnManageExit]);

  useEffect(() => {
    if (!manageMode) return;
    setSelectedBookIds((prev) => {
      const selectable = new Set(selectableBookIds);
      const pruned = new Set([...prev].filter((id) => selectable.has(id)));
      return pruned.size === prev.size ? prev : pruned;
    });
  }, [manageMode, selectableBookIds]);

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
    await scrollPreservingUpdate(
      async () => {
        await reorderReadingHistory(fromIndex, toIndex);
        return getReadingHistory();
      },
      (history) => {
        setReadingHistory(history);
        setRenderTick((k) => k + 1);
      },
    );
  }, []);

  const handleCollectionReorder = useCallback(async (fromIndex, toIndex) => {
    await scrollPreservingUpdate(
      async () => {
        await reorderCollectionBooks(activeTab, fromIndex, toIndex);
        return getCollections();
      },
      (cols) => {
        setCollections(cols);
        setRenderTick((k) => k + 1);
      },
    );
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
        if (activeTab === ALL_TAB) {
          setRefreshKey((k) => k + 1);
        } else {
          await reloadDataKeepingScroll();
        }
      },
    });
  }, [activeTab, conversionMode, variant, clearBookRefreshErrors, reloadDataKeepingScroll]);

  const handleRemoveFromCollection = useCallback((e, bookId, bookInfo) => {
    e.stopPropagation();
    if (!activeCollection) return;
    const { book_name: bookName } = resolveBookDisplay(bookInfo, variant, bookId);
    const convertedName = maybeConvert(bookName, conversionMode) || bookId;
    setConfirmDialog({
      title: '移除書籍',
      message: (
        <ModalText>
          確定要從「<strong>{activeCollection.name}</strong>」收藏中移除 <strong>{convertedName}</strong> 嗎？
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
    const result = await startDownloadAllForBookSafe({
      bookId,
      startDownloadAll,
      showToast,
    });
    if (result.ok) {
      navigate(ROUTES.download);
    }
  }, [navigate, showToast, startDownloadAll]);

  const handleGoToDownload = async () => {
    if (selectedBookIds.size !== 1) return;
    await handleBookDownload(Array.from(selectedBookIds)[0]);
  };

  const handleBookExport = useCallback((bookId) => {
    setExportBookId(bookId);
  }, []);

  const handleGoToExport = () => {
    if (selectedBookIds.size !== 1) return;
    setExportBookId(Array.from(selectedBookIds)[0]);
  };

  const onBulkRefresh = () => {
    handleBulkRefresh(Array.from(selectedBookIds), showToast);
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
          確定要從「<strong>{activeCollection.name}</strong>」收藏中移除已選的 <strong>{ids.length}</strong> 本書籍嗎？
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

  const handleBulkDeleteLocalData = () => {
    if (selectedBookIds.size === 0) return;
    const ids = Array.from(selectedBookIds);
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
  const manageBarVisible = manageMode && !reorderMode;

  return (
    <Wrapper
      key={refreshKey}
      $gap={24}
      $paddingBottom={manageBarVisible ? 124 : undefined}
      $paddingBottomMobile={manageBarVisible ? 116 : undefined}
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
            manageMode={manageMode}
            onManageModeToggle={handleManageModeToggle}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
            navigate={navigate}
            filterCategories={filterCategories}
            bookFilters={bookFilters}
            onBookFiltersChange={setBookFilters}
            filtersExpanded={filtersExpanded}
            onFiltersExpandedChange={setFiltersExpanded}
            conversionMode={conversionMode}
            filterItems={filterBaseItems}
            getFilterMeta={getFilterMeta}
            filteredCount={booksForDisplay.length}
          />

          {reorderMode && canReorder && (
            <ReorderHint>
              {viewMode === 'grid'
                ? '拖曳書籍頂部的握把以調整順序，完成後再次點擊「調序」退出'
                : '拖曳書籍左側的握把以調整順序，完成後再次點擊「調序」退出'}
            </ReorderHint>
          )}

          {manageMode && !reorderMode && (
            <ReorderHint>點擊書籍以選取，使用底部工具列進行管理，完成後再次點擊「管理」退出</ReorderHint>
          )}

          <BookshelfBookList
            activeTab={activeTab}
            sortedDisplayBooks={sortedDisplayBooks}
            booksForDisplay={booksForDisplay}
            viewMode={viewMode}
            canReorder={canReorder}
            reorderMode={reorderMode}
            manageMode={manageMode}
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
            onBookDeleteLocalData={handleDeleteBook}
            onBookAddToCollection={handleAddToCollection}
            onBookDownload={handleBookDownload}
            onBookExport={handleBookExport}
          />

          {manageBarVisible && (
            <BookshelfManageActionBar
              activeTab={activeTab}
              selectedCount={selectedBookIds.size}
              allBooksSelected={allBooksSelected}
              selectableBookIds={selectableBookIds}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onBulkAddToCollection={handleBulkAddToCollection}
              onGoToDownload={handleGoToDownload}
              onGoToExport={handleGoToExport}
              onBulkRefresh={onBulkRefresh}
              onBulkDelete={handleBulkDelete}
              onBulkDeleteLocalData={handleBulkDeleteLocalData}
              isRefreshing={refreshingBookIds.size > 0}
              onExitManageMode={handleManageModeToggle}
            />
          )}

          <BookshelfModals
            showCollectionManagement={showCollectionManagement}
            collections={collections}
            activeTab={activeTab}
            onCloseCollectionManagement={() => setShowCollectionManagement(false)}
            onCreateCollectionInManagement={handleCreateCollectionInManagement}
            onRenameCollectionInManagement={handleRenameCollectionInManagement}
            onDeleteCollectionInManagement={handleDeleteCollectionInManagement}
            onCollectionsReorder={handleCollectionsReorder}
            addToCollectionBookIds={addToCollectionBookIds}
            newCollectionName={newCollectionName}
            onNewCollectionNameChange={setNewCollectionName}
            onCloseAddToCollection={() => setAddToCollectionBookIds(null)}
            onToggleBooksInCollection={handleToggleBooksInCollection}
            onCreateCollectionFromModal={handleCreateCollectionFromModal}
            confirmDialog={confirmDialog}
            onConfirmDialog={handleConfirmDialog}
            onCloseConfirmDialog={closeConfirmDialog}
            exportBookId={exportBookId}
            conversionMode={conversionMode}
            displayVariant={variant}
            showToast={showToast}
            onCloseExport={() => setExportBookId(null)}
          />
        </>
      )}
    </Wrapper>
  );
}

export default BookshelfContent;
