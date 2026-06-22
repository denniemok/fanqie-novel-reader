import EmptyHint from '../common/EmptyHint';
import GridCard from './GridCard';
import ListCard from './ListCard';
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
  settingsMode,
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

  const selectionMode = settingsMode && !reorderMode;

  const bookCardProps = (bookId) => ({
    bookId,
    onClick: () => onBookClick(bookId),
    conversionMode,
    sortBy,
    selectionMode,
    isSelected: selectedBookIds.has(bookId),
    onToggleSelect: () => onToggleBookSelection(bookId),
    bulkRefreshing: refreshingBookIds.has(bookId),
    refreshError: bookRefreshErrors[bookId],
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
          onReorder={onReorder}
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
        onReorder={onReorder}
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
}

export default BookshelfBookList;
