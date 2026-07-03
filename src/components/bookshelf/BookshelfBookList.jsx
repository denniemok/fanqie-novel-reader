import EmptyHint from '../ui/EmptyHint';
import BookshelfGridCard from './BookshelfGridCard';
import BookshelfListCard from './BookshelfListCard';
import SortableBooks from './SortableBooks';
import { ALL_TAB } from './constants';
import { GridLayout, ListLayout } from './styles';

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
  const showListActions = !selectionMode && !reorderMode;
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
  });

  const listCardProps = (bookId) => ({
    ...bookCardProps(bookId),
    showActions: showListActions,
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
            <BookshelfListCard
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
          <BookshelfListCard key={bookId} {...listCardProps(bookId)} />
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
            <BookshelfGridCard
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
            <BookshelfGridCard key={bookId} {...gridCardProps(bookId)} />
      ))}
    </GridLayout>
  );
}

export default BookshelfBookList;
