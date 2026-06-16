import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import {
  Hand,
  ArrowDownZA,
  ArrowUpAZ,
  Grid2X2,
  LayoutList,
  Plus,
  Folders,
  FolderInput,
  Trash2,
  Settings,
  RefreshCw,
  Loader2,
  SquareCheckBig,
  SquareX,
  Search,
  X,
  Download,
} from 'lucide-react';
import ListCard from './ListCard';
import PageContent from '../common/PageContent';
import GridCard from './GridCard';
import SortableBooks from './SortableBooks';
import CollectionModal from './CollectionModal';
import CollectionManagementModal from './CollectionManagementModal';
import ConfirmModal from '../common/ConfirmModal';
import SelectDropdown from '../common/SelectDropdown';
import { ModalText } from '../common/ModalBase';
import { CardActionButton, CardSpinningIcon } from '../common/CardActionButton';
import { useToast } from '../../contexts/ToastContext';
import { useDownloadManager } from '../../contexts/DownloadManager';
import { buildCatalogUrl, ROUTES } from '../../utils/navigation';
import { formatErrorMessage } from '../../utils/errors';
import { fetchBookDetailAndDirectory, getCachedOrFetchDirectory } from '../../utils/api-helpers';
import { SAMPLE_READING_HISTORY_BOOK_ID } from '../../utils/constants';
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
import { BOOKSHELF_SORT_OPTIONS, sortBookshelfItems } from '../../utils/bookshelfSort';
import { useBookshelfSortMeta } from '../../hooks/useBookshelfSortMeta';
import { useBookshelfSearchMeta, bookMatchesBookshelfSearch } from '../../hooks/useBookshelfSearchMeta';

const ALL_TAB = 'all';

const toolbarRetroUnit = css`
  border: var(--retro-border-width) solid color-mix(in srgb, var(--border-color) 85%, transparent);
  box-shadow: var(--retro-shadow);
  transition: all 0.1s steps(2);

  @media (hover: hover) {
    &:hover {
      border-color: var(--accent-color);
      transform: translate(-1px, -1px);
      box-shadow: var(--retro-shadow-hover);
    }
  }
`;

// ── Layout ──────────────────────────────────────────────────────────────────

const Wrapper = styled(PageContent)``;

const TabBar = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  ${toolbarRetroUnit}

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.button`
  flex-shrink: 0;
  padding: 13px 18px;
  min-height: 44px;
  background: ${(p) => (p.$active ? 'var(--accent-color)' : 'var(--background-color2)')};
  color: ${(p) => (p.$active ? 'var(--text-on-accent)' : 'var(--text-color-secondary)')};
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
    color: ${(p) => (p.$active ? 'var(--text-on-accent)' : 'var(--text-color)')};
  }

  @media (max-width: 374px) {
    padding: 10px 12px;
    font-size: 13px;
    max-width: 140px;
  }
`;

const TabInner = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  max-width: 100%;
  min-width: 0;
`;

const TabName = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

const TabCount = styled.span`
  flex-shrink: 0;
  opacity: 0.85;
`;

const TOOLBAR_CONTROL_HEIGHT = '44px';

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: ${TOOLBAR_CONTROL_HEIGHT};
  box-sizing: border-box;
  padding: 0 12px;
  background: color-mix(in srgb, var(--background-color2) 48%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  ${toolbarRetroUnit}

  &:focus-within {
    border-color: var(--accent-color);
    transform: translate(-1px, -1px);
    box-shadow: var(--retro-shadow-hover);
  }

  svg.search-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    color: var(--text-color-secondary);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--text-color);
  font-size: 14px;
  font-family: var(--ui-font-family);
  outline: none;

  &::-webkit-search-cancel-button,
  &::-webkit-search-decoration {
    -webkit-appearance: none;
    display: none;
  }

  &[type='search'] {
    -webkit-appearance: none;
    appearance: none;
  }

  &::placeholder {
    color: var(--text-color-secondary);
    opacity: 0.55;
  }
`;

const SearchClearBtn = styled.button`
  padding: 0;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border: var(--retro-border-width) solid color-mix(in srgb, var(--border-color) 85%, transparent);
  border-radius: 0;
  background: color-mix(in srgb, var(--background-color2) 48%, transparent);
  color: var(--text-color-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--retro-shadow);
  transition: all 0.1s steps(2);

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    border-color: var(--accent-color);
    color: var(--accent-color);
    transform: translate(-1px, -1px);
    box-shadow: var(--retro-shadow-hover);
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: var(--retro-shadow);
  }
`;

const TabActions = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
  min-height: ${TOOLBAR_CONTROL_HEIGHT};
`;

const BookshelfToolbar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 30;
`;

const ViewToggle = styled.div`
  display: flex;
  align-items: stretch;
  gap: 0;
  height: ${TOOLBAR_CONTROL_HEIGHT};
  box-sizing: border-box;
  overflow: hidden;
  ${toolbarRetroUnit}
`;

const ToolbarRight = styled.div`
  display: flex;
  align-items: stretch;
  gap: 8px;
  margin-left: auto;
  flex-wrap: wrap;

  @media (max-width: 374px) {
    gap: 4px;
  }
`;

const SortUnit = styled.div`
  display: inline-flex;
  align-items: stretch;
  height: ${TOOLBAR_CONTROL_HEIGHT};
  box-sizing: border-box;
  border-radius: 0;
  ${toolbarRetroUnit}
`;

const SortTrailingBtn = styled.button`
  padding: 0 12px;
  height: 100%;
  box-sizing: border-box;
  background: ${(p) => (p.$active ? 'var(--accent-color)' : 'var(--background-color2)')};
  color: ${(p) => (p.$active ? 'var(--text-on-accent)' : 'var(--accent-color)')};
  border: none;
  border-left: 1px solid var(--border-color);
  border-radius: 0;
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

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  &:hover {
    background: ${(p) => (p.$active ? 'var(--accent-hover)' : 'var(--hover-background-color)')};
  }

  @media (max-width: 480px) {
    min-width: ${TOOLBAR_CONTROL_HEIGHT};
    width: ${TOOLBAR_CONTROL_HEIGHT};
    padding: 0;
    gap: 0;
    flex-shrink: 0;
  }
`;

const BtnLabel = styled.span`
  @media (max-width: 480px) {
    display: none;
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
  color: ${(p) => (p.$active ? 'var(--text-on-accent)' : 'var(--text-color-secondary)')};
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

  @media (max-width: 480px) {
    min-width: ${TOOLBAR_CONTROL_HEIGHT};
    width: ${TOOLBAR_CONTROL_HEIGHT};
    padding: 0;
    gap: 0;
    flex-shrink: 0;
  }
`;

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  align-items: stretch;

  @media (max-width: 400px) {
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

const ManageActionBar = styled.div`
  position: fixed;
  left: 50%;
  bottom: calc(16px + env(safe-area-inset-bottom));
  transform: translateX(-50%);
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  max-width: min(640px, calc(100vw - 32px));
  box-sizing: border-box;
  background: var(--card-surface);
  border: var(--retro-border-width) solid var(--border-color);
  box-shadow: var(--retro-shadow-hover);
  border-radius: var(--border-radius-sm);

  @media (max-width: 480px) {
    gap: 8px;
    padding: 8px 10px;
    max-width: calc(100vw - 24px);
  }
`;

const ManageActionCount = styled.span`
  font-size: 14px;
  font-weight: 700;
  font-family: var(--ui-font-family);
  color: var(--text-color);
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 3.5em;

  @media (max-width: 480px) {
    font-size: 13px;
    min-width: 3em;
  }
`;

const ManageBarButton = styled(CardActionButton)`
  border-radius: 0;
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  padding: 0;
  box-sizing: border-box;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ManageActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  justify-content: flex-end;
  min-width: 0;
`;

// ── Main component ────────────────────────────────────────────────────────────

function Content({ conversionMode = 'tw' }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { startDownloadAll } = useDownloadManager();

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
  const [searchQuery, setSearchQuery] = useState('');
  const [reorderMode, setReorderMode] = useState(false);
  const [settingsMode, setSettingsMode] = useState(false);
  const [selectedBookIds, setSelectedBookIds] = useState(() => new Set());
  const [refreshingBookIds, setRefreshingBookIds] = useState(() => new Set());
  const [bookDataVersions, setBookDataVersions] = useState({});
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

  const searchMetaRefreshKey = useMemo(
    () => bookIds.map((id) => bookDataVersions[id] || 0).join(','),
    [bookIds, bookDataVersions]
  );
  const searchMetaMap = useBookshelfSearchMeta(bookIds, searchMetaRefreshKey);

  const hasSearch = Boolean(searchQuery.trim());
  const booksForDisplay = useMemo(() => {
    if (!hasSearch) return sortedDisplayBooks;
    return sortedDisplayBooks.filter(({ bookId }) =>
      bookMatchesBookshelfSearch(searchMetaMap[bookId], bookId, searchQuery, conversionMode)
    );
  }, [sortedDisplayBooks, searchQuery, searchMetaMap, conversionMode, hasSearch]);

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
    if (hasSearch) setReorderMode(false);
  }, [hasSearch]);

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

  const handleBulkAddToCollection = () => {
    if (selectedBookIds.size === 0) return;
    handleAddToCollection(Array.from(selectedBookIds));
  };

  const handleGoToDownload = async () => {
    if (selectedBookIds.size !== 1) return;
    const bookId = Array.from(selectedBookIds)[0];

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
  };

  const handleBulkRefresh = async () => {
    if (selectedBookIds.size === 0 || refreshingBookIds.size > 0) return;
    const ids = Array.from(selectedBookIds);
    setRefreshingBookIds(new Set(ids));

    const results = await Promise.allSettled(
      ids.map(async (bookId) => {
        try {
          await fetchBookDetailAndDirectory(bookId, { forceRefresh: true });
          setBookDataVersions((prev) => ({
            ...prev,
            [bookId]: (prev[bookId] || 0) + 1,
          }));
        } finally {
          setRefreshingBookIds((prev) => {
            const next = new Set(prev);
            next.delete(bookId);
            return next;
          });
        }
      })
    );

    const failed = results.filter((result) => result.status === 'rejected').length;

    if (failed > 0) {
      showToast(`${ids.length - failed} 本刷新成功，${failed} 本失敗`);
    } else {
      showToast(`已刷新 ${ids.length} 本書籍`);
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

  const canReorder = sortBy === 'manual' && (activeTab !== ALL_TAB || !isSampleOnly);

  useEffect(() => {
    if (!canReorder) setReorderMode(false);
  }, [canReorder]);

  const handleReorder = activeTab === ALL_TAB ? handleHistoryReorder : handleCollectionReorder;

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

    if (booksForDisplay.length === 0) {
      return <EmptyHint>沒有符合的書籍</EmptyHint>;
    }

    const selectionMode = settingsMode && !reorderMode;

    const bookCardProps = (bookId) => ({
      bookId,
      onClick: () => goToCatalog(bookId),
      conversionMode,
      sortBy,
      selectionMode,
      isSelected: selectedBookIds.has(bookId),
      onToggleSelect: () => toggleBookSelection(bookId),
      bulkRefreshing: refreshingBookIds.has(bookId),
      bookDataVersion: bookDataVersions[bookId] || 0,
    });

    if (viewMode === 'list') {
      if (canReorder && reorderMode) {
        return (
          <SortableBooks
            key={`list-${activeTab}-${renderTick}`}
            layout="list"
            items={booksForDisplay}
            getKey={({ bookId }) => bookId}
            onReorder={handleReorder}
            renderItem={({ bookId }, sortable) => (
              <ListCard
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
          {booksForDisplay.map(({ bookId }) => (
            <ListCard key={bookId} {...bookCardProps(bookId)} />
          ))}
        </ListLayout>
      );
    }

    if (canReorder && reorderMode) {
      return (
        <SortableBooks
          key={`grid-${activeTab}-${renderTick}`}
          layout="grid"
          items={booksForDisplay}
          getKey={({ bookId }) => bookId}
          onReorder={handleReorder}
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
        {booksForDisplay.map(({ bookId }) => (
          <GridCard key={bookId} {...bookCardProps(bookId)} />
        ))}
      </GridLayout>
    );
  };

  const manageBarVisible = settingsMode && !reorderMode;

  return (
    <Wrapper
      key={refreshKey}
      $variant="bookshelf"
      $gap={20}
      $paddingBottom={manageBarVisible ? 88 : undefined}
      $paddingBottomMobile={manageBarVisible ? 80 : undefined}
    >
      {!dataLoaded ? (
        <EmptyHint>載入中…</EmptyHint>
      ) : (
        <>
      <BookshelfToolbar>
      <TabBar>
        <Tab
          $active={activeTab === ALL_TAB}
          onClick={() => setActiveTab(ALL_TAB)}
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
            onClick={() => setActiveTab(col.id)}
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
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="搜尋書名或作者"
          aria-label="搜尋書名或作者"
        />
        {searchQuery && (
          <SearchClearBtn
            type="button"
            onClick={() => setSearchQuery('')}
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
              onClick={() => setShowCollectionManagement(true)}
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
              onChange={handleSortChange}
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
                onClick={handleSortDirectionToggle}
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
                onClick={handleReorderModeToggle}
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
              onClick={handleSettingsModeToggle}
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
              onClick={() => handleViewModeChange('list')}
              title="列表視圖"
              aria-label="列表視圖"
            >
              <LayoutList />
              <BtnLabel>列表</BtnLabel>
            </ToggleBtn>
            <ToggleBtn
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
      </BookshelfToolbar>

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

      {renderBooks()}

      {manageBarVisible && (
        <ManageActionBar>
          <ManageActionCount>{selectedBookIds.size} 已選</ManageActionCount>
          <ManageActionButtons>
            <ManageBarButton
              type="button"
              disabled={allBooksSelected || selectableBookIds.length === 0}
              onClick={handleSelectAll}
              title="全選"
              aria-label="全選"
            >
              <SquareCheckBig />
            </ManageBarButton>
            <ManageBarButton
              type="button"
              disabled={selectedBookIds.size === 0}
              onClick={handleDeselectAll}
              title="全不選"
              aria-label="全不選"
            >
              <SquareX />
            </ManageBarButton>
            <ManageBarButton
              type="button"
              $variant="collection"
              disabled={selectedBookIds.size === 0}
              onClick={handleBulkAddToCollection}
              title="加入收藏夾"
              aria-label="加入收藏夾"
            >
              <FolderInput />
            </ManageBarButton>
            {selectedBookIds.size === 1 && (
              <ManageBarButton
                type="button"
                $variant="download"
                onClick={handleGoToDownload}
                title="下載全部"
                aria-label="下載全部"
              >
                <Download />
              </ManageBarButton>
            )}
            <ManageBarButton
              type="button"
              $variant="refresh"
              disabled={selectedBookIds.size === 0 || refreshingBookIds.size > 0}
              onClick={handleBulkRefresh}
              title="刷新目錄與書籍資料"
              aria-label="刷新目錄與書籍資料"
            >
              {refreshingBookIds.size > 0 ? (
                <CardSpinningIcon><Loader2 size={18} /></CardSpinningIcon>
              ) : (
                <RefreshCw />
              )}
            </ManageBarButton>
            <ManageBarButton
              type="button"
              $variant="delete"
              disabled={selectedBookIds.size === 0}
              onClick={handleBulkDelete}
              title={activeTab === ALL_TAB ? '刪除所選書籍' : '從收藏夾移除'}
              aria-label={activeTab === ALL_TAB ? '刪除所選書籍' : '從收藏夾移除'}
            >
              <Trash2 />
            </ManageBarButton>
          </ManageActionButtons>
        </ManageActionBar>
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
