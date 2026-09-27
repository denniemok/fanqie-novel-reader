import EmptyHint from '../ui/EmptyHint';
import { ModalPrimaryButton as EmptyAction } from '../ui/ModalBase';
import BookshelfBookGridCard from './BookshelfBookGridCard';
import BookshelfBookListCard from './BookshelfBookListCard';
import SortableBooks from '../ui/SortableBooks';
import { useBookshelfQuickAction } from '../../contexts/BookshelfQuickActionContext';
import { ALL_TAB } from './constants';
import { GridLayout, ListLayout } from '../layout/BookListLayouts';

function BookshelfBookList({
  activeTab,
  sortedDisplayBooks,
  booksForDisplay,
  viewMode,
  canReorder,
  reorderMode,
  manageMode,
  conversionMode,
  sortBy,
  selectedBookIds,
  refreshingBookIds,
  bookRefreshErrors,
  bookDataVersions,
  renderTick,
  onBookClick,
  onToggleBookSelection,
  onReorder,
  onBookRefresh,
  onBookDelete,
  onBookDeleteLocalData,
  onBookAddToCollection,
  onBookDownload,
  onBookExport,
  onDiscover,
}) {
  const { enabled: bookshelfQuickAction } = useBookshelfQuickAction();

  if (sortedDisplayBooks.length === 0) {
    return (
      <EmptyHint>
        {activeTab === ALL_TAB ? '書架仍然是空的，從下一本故事開始吧。' : '這個收藏夾暫時沒有書籍。'}
        {activeTab === ALL_TAB && <EmptyAction type="button" onClick={onDiscover}>開始找書</EmptyAction>}
      </EmptyHint>
    );
  }

  if (booksForDisplay.length === 0) return <EmptyHint>找不到符合目前搜尋或篩選條件的書籍。</EmptyHint>;

  const selectionMode = manageMode && !reorderMode;
  const showQuickActions = bookshelfQuickAction && !selectionMode && !reorderMode;
  const isAllTab = activeTab === ALL_TAB;
  const bookCardProps = (bookId) => ({
    bookId,
    onClick: () => onBookClick(bookId),
    conversionMode,
    selectionMode,
    isSelected: selectedBookIds.has(bookId),
    onToggleSelect: () => onToggleBookSelection(bookId),
    bulkRefreshing: refreshingBookIds.has(bookId),
    refreshError: bookRefreshErrors[bookId],
    bookDataVersion: bookDataVersions[bookId] || 0,
  });
  const gridCardProps = (bookId) => ({
    ...bookCardProps(bookId),
    sortBy,
    showActions: showQuickActions,
    onRefreshClick: onBookRefresh,
    onDeleteClick: onBookDelete,
    onDeleteLocalDataClick: isAllTab ? undefined : onBookDeleteLocalData,
    onAddToCollection: onBookAddToCollection,
    onDownload: onBookDownload,
    onExport: onBookExport,
    isAllTab,
  });
  const listCardProps = (bookId) => ({
    ...bookCardProps(bookId),
    showActions: showQuickActions,
    onRefreshClick: onBookRefresh,
    onDeleteClick: onBookDelete,
    onDeleteLocalDataClick: isAllTab ? undefined : onBookDeleteLocalData,
    onAddToCollection: onBookAddToCollection,
    onDownload: onBookDownload,
    onExport: onBookExport,
    isAllTab,
  });
  const renderListCard = ({ bookId }, sortable) => (
    <BookshelfBookListCard {...listCardProps(bookId)} {...sortable} />
  );
  const renderGridCard = ({ bookId }, sortable) => (
    <BookshelfBookGridCard {...gridCardProps(bookId)} {...sortable} />
  );

  if (viewMode === 'list') {
    return canReorder && reorderMode ? (
      <SortableBooks key={`list-${activeTab}-${renderTick}`} layout="list" items={booksForDisplay} getKey={({ bookId }) => bookId} onReorder={onReorder} renderItem={renderListCard} />
    ) : (
      <ListLayout key={`list-${activeTab}-${renderTick}`}>
        {booksForDisplay.map(({ bookId }) => <BookshelfBookListCard key={bookId} {...listCardProps(bookId)} />)}
      </ListLayout>
    );
  }

  return canReorder && reorderMode ? (
    <SortableBooks key={`grid-${activeTab}-${renderTick}`} layout="grid" items={booksForDisplay} getKey={({ bookId }) => bookId} onReorder={onReorder} renderItem={renderGridCard} />
  ) : (
    <GridLayout key={`grid-${activeTab}-${renderTick}`}>
      {booksForDisplay.map(({ bookId }) => <BookshelfBookGridCard key={bookId} {...gridCardProps(bookId)} />)}
    </GridLayout>
  );
}

export default BookshelfBookList;
