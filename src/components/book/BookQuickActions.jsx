import { FolderInput, FolderMinus, Download, FileText, RefreshCw, Trash2, Loader2 } from 'lucide-react';
import { CardActionButton, CardSpinningIcon } from './CardActionButton';

export function getDeleteLocalDataLabel() {
  return '刪除此書的本地資料';
}

export function getRemoveFromCollectionLabel() {
  return '從收藏夾移除';
}

export function getDeleteActionLabel(isAllTab) {
  return isAllTab ? getDeleteLocalDataLabel() : getRemoveFromCollectionLabel();
}

/**
 * Renders per-book quick action buttons for card overlays and manage bars.
 * Accepts any button component that supports CardActionButton props (e.g. ManageBarButton).
 */
export function BookQuickActions({
  ButtonComponent = CardActionButton,
  bookId,
  bookInfo,
  isAllTab = true,
  isRefreshing = false,
  showCollection = true,
  showDownload = true,
  showExport = true,
  stopPropagation = true,
  onAddToCollection,
  onDownload,
  onExport,
  onRefreshClick,
  refetch,
  onDeleteClick,
  onDeleteLocalDataClick,
}) {
  const wrapClick = (handler) => {
    if (!handler) return undefined;
    if (!stopPropagation) return handler;
    return (e) => {
      e.stopPropagation();
      handler(e);
    };
  };

  const deleteLabel = getDeleteActionLabel(isAllTab);
  const deleteLocalDataLabel = getDeleteLocalDataLabel();

  return (
    <>
      {showCollection && onAddToCollection && (
        <ButtonComponent
          type="button"
          $variant="collection"
          onClick={wrapClick(() => onAddToCollection(bookId))}
          title="加入收藏夾"
          aria-label="加入收藏夾"
        >
          <FolderInput />
        </ButtonComponent>
      )}
      {showDownload && onDownload && (
        <ButtonComponent
          type="button"
          $variant="download"
          onClick={wrapClick(() => onDownload(bookId))}
          title="下載全部"
          aria-label="下載全部"
        >
          <Download />
        </ButtonComponent>
      )}
      {showExport && onExport && (
        <ButtonComponent
          type="button"
          $variant="export"
          onClick={wrapClick(() => onExport(bookId))}
          title="匯出書籍"
          aria-label="匯出書籍"
        >
          <FileText />
        </ButtonComponent>
      )}
      <ButtonComponent
        type="button"
        $variant="refresh"
        disabled={isRefreshing}
        onClick={wrapClick((e) => (onRefreshClick ?? refetch)(e, bookId))}
        title="刷新目錄與書籍資料"
        aria-label="刷新目錄與書籍資料"
      >
        {isRefreshing ? (
          <CardSpinningIcon><Loader2 size={18} /></CardSpinningIcon>
        ) : (
          <RefreshCw />
        )}
      </ButtonComponent>
      {!isAllTab && onDeleteLocalDataClick && (
        <ButtonComponent
          type="button"
          $variant="delete"
          onClick={wrapClick((e) => onDeleteLocalDataClick(e, bookId, bookInfo))}
          title={deleteLocalDataLabel}
          aria-label={deleteLocalDataLabel}
        >
          <Trash2 />
        </ButtonComponent>
      )}
      <ButtonComponent
        type="button"
        $variant={isAllTab ? 'delete' : 'collection'}
        onClick={wrapClick((e) => onDeleteClick?.(e, bookId, bookInfo))}
        title={deleteLabel}
        aria-label={deleteLabel}
      >
        {isAllTab ? <Trash2 /> : <FolderMinus />}
      </ButtonComponent>
    </>
  );
}
