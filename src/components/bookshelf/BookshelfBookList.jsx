import EmptyHint from '../ui/EmptyHint';
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
}) {
  const { enabled: bookshelfQuickAction } = useBookshelfQuickAction();

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

  if (viewMode === 'list') {
    if (canReorder && reorderMode) {
      return (
        <SortableBooks
          key={`list-${activeTab}-${renderTick}`}
          layout="list"
          items={booksForDisplay}
          getKey={({ bookId }) => bookId}
          onReorder={onReorder}
          renderItem={({ bookId }, sortable) => (
            <BookshelfBookListCard
              {...listCardProps(bookId)}
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
          <BookshelfBookListCard key={bookId} {...listCardProps(bookId)} />
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
        onReorder={onReorder}
        renderItem={({ bookId }, sortable) => (
            <BookshelfBookGridCard
            {...gridCardProps(bookId)}
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
            <BookshelfBookGridCard key={bookId} {...gridCardProps(bookId)} />
      ))}
    </GridLayout>
  );
}

export default BookshelfBookList;
