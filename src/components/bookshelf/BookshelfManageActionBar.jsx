import {
  SquareCheckBig,
  SquareX,
  FolderInput,
  FolderMinus,
  Trash2,
  Download,
  FileText,
  RefreshCw,
  Loader2,
  X,
} from 'lucide-react';
import { CardSpinningIcon } from '../book/CardActionButton';
import { getDeleteLocalDataLabel, getRemoveFromCollectionLabel } from '../book/BookQuickActions';
import { ALL_TAB } from './constants';
import {
  BookshelfManageActionBar as BookshelfManageActionBarRoot,
  BookshelfManageSelectionRow,
  BookshelfManageActionCount,
  BookshelfManageSelectionButtons,
  BookshelfManageSelectionButton,
  BookshelfManageActionButtons,
  BookshelfManageBarButton,
  BookshelfManageExitButton,
} from './styles';

function BookshelfManageActionBar({
  activeTab,
  selectedCount,
  allBooksSelected,
  selectableBookIds,
  onSelectAll,
  onDeselectAll,
  onBulkAddToCollection,
  onGoToDownload,
  onGoToExport,
  onBulkRefresh,
  onBulkDelete,
  onBulkDeleteLocalData,
  isRefreshing,
  onExitManageMode,
}) {
  const isAllTab = activeTab === ALL_TAB;
  const bulkDeleteLabel = isAllTab ? '刪除所選書籍' : getRemoveFromCollectionLabel();
  const bulkDeleteLocalDataLabel = getDeleteLocalDataLabel();

  return (
    <BookshelfManageActionBarRoot>
      <BookshelfManageExitButton
        type="button"
        onClick={onExitManageMode}
        title="退出管理"
        aria-label="退出管理"
      >
        <X strokeWidth={2.25} />
      </BookshelfManageExitButton>
      <BookshelfManageSelectionRow>
        <BookshelfManageActionCount>{selectedCount} 已選</BookshelfManageActionCount>
        <BookshelfManageSelectionButtons>
          <BookshelfManageSelectionButton
            type="button"
            disabled={allBooksSelected || selectableBookIds.length === 0}
            onClick={onSelectAll}
            title="全選"
            aria-label="全選"
          >
            <SquareCheckBig />
          </BookshelfManageSelectionButton>
          <BookshelfManageSelectionButton
            type="button"
            disabled={selectedCount === 0}
            onClick={onDeselectAll}
            title="全不選"
            aria-label="全不選"
          >
            <SquareX />
          </BookshelfManageSelectionButton>
        </BookshelfManageSelectionButtons>
      </BookshelfManageSelectionRow>
      <BookshelfManageActionButtons>
        <BookshelfManageBarButton
          type="button"
          $variant="collection"
          disabled={selectedCount === 0}
          onClick={onBulkAddToCollection}
          title="加入收藏夾"
          aria-label="加入收藏夾"
        >
          <FolderInput />
        </BookshelfManageBarButton>
        {selectedCount === 1 && (
          <>
            <BookshelfManageBarButton
              type="button"
              $variant="download"
              onClick={onGoToDownload}
              title="下載全部"
              aria-label="下載全部"
            >
              <Download />
            </BookshelfManageBarButton>
            <BookshelfManageBarButton
              type="button"
              $variant="export"
              onClick={onGoToExport}
              title="匯出書籍"
              aria-label="匯出書籍"
            >
              <FileText />
            </BookshelfManageBarButton>
          </>
        )}
        <BookshelfManageBarButton
          type="button"
          $variant="refresh"
          disabled={selectedCount === 0 || isRefreshing}
          onClick={onBulkRefresh}
          title="刷新目錄與書籍資料"
          aria-label="刷新目錄與書籍資料"
        >
          {isRefreshing ? (
            <CardSpinningIcon><Loader2 size={18} /></CardSpinningIcon>
          ) : (
            <RefreshCw />
          )}
        </BookshelfManageBarButton>
        {!isAllTab && onBulkDeleteLocalData && (
          <BookshelfManageBarButton
            type="button"
            $variant="delete"
            disabled={selectedCount === 0}
            onClick={onBulkDeleteLocalData}
            title={bulkDeleteLocalDataLabel}
            aria-label={bulkDeleteLocalDataLabel}
          >
            <Trash2 />
          </BookshelfManageBarButton>
        )}
        <BookshelfManageBarButton
          type="button"
          $variant={isAllTab ? 'delete' : 'collection'}
          disabled={selectedCount === 0}
          onClick={onBulkDelete}
          title={bulkDeleteLabel}
          aria-label={bulkDeleteLabel}
        >
          {isAllTab ? <Trash2 /> : <FolderMinus />}
        </BookshelfManageBarButton>
      </BookshelfManageActionButtons>
    </BookshelfManageActionBarRoot>
  );
}

export default BookshelfManageActionBar;
