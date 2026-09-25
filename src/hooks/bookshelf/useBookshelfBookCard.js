import { useBookLoader } from '../book/useBookLoader';
import { useErrorToast } from '../useErrorToast';

export function useBookshelfBookCard({
  bookId,
  bookDataVersion = 0,
  bulkRefreshing = false,
  reorderMode,
  selectionMode = false,
  onToggleSelect,
  canClick,
  onClick,
  showActions = false,
  isAllTab = true,
  onAddToCollection,
  onDownload,
  onExport,
  onRefreshClick,
  onDeleteClick,
  onDeleteLocalDataClick,
}) {
  const { bookInfo, isLoading, refetch, isRefreshing: hookRefreshing, error } = useBookLoader(bookId, {
    detailOnly: true,
    bookDataVersion,
  });
  const isRefreshing = hookRefreshing || bulkRefreshing;
  useErrorToast(error);

  const handleCardClick = () => {
    if (reorderMode) return;
    if (selectionMode) {
      onToggleSelect?.();
      return;
    }
    if (canClick && !canClick()) return;
    onClick?.();
  };

  const showItemActions = showActions && !selectionMode && !reorderMode;
  const actionProps = {
    bookId,
    bookInfo,
    isAllTab,
    isRefreshing,
    onAddToCollection,
    onDownload,
    onExport,
    onRefreshClick,
    refetch,
    onDeleteClick,
    onDeleteLocalDataClick,
  };

  return {
    bookInfo,
    isLoading,
    isRefreshing,
    handleCardClick,
    showItemActions,
    actionProps,
  };
}
