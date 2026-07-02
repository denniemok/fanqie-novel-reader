import {
  SquareCheckBig,
  SquareX,
  FolderInput,
  Trash2,
  Download,
  FileText,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { CardSpinningIcon } from '../common/CardActionButton';
import { ALL_TAB } from './constants';
import {
  ManageActionBar as ManageActionBarRoot,
  ManageActionCount,
  ManageActionButtons,
  ManageBarButton,
} from './styles';

function ManageActionBar({
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
  isRefreshing,
}) {
  return (
    <ManageActionBarRoot>
      <ManageActionCount>{selectedCount} 已選</ManageActionCount>
      <ManageActionButtons>
        <ManageBarButton
          type="button"
          disabled={allBooksSelected || selectableBookIds.length === 0}
          onClick={onSelectAll}
          title="全選"
          aria-label="全選"
        >
          <SquareCheckBig />
        </ManageBarButton>
        <ManageBarButton
          type="button"
          disabled={selectedCount === 0}
          onClick={onDeselectAll}
          title="全不選"
          aria-label="全不選"
        >
          <SquareX />
        </ManageBarButton>
        <ManageBarButton
          type="button"
          $variant="collection"
          disabled={selectedCount === 0}
          onClick={onBulkAddToCollection}
          title="加入收藏夾"
          aria-label="加入收藏夾"
        >
          <FolderInput />
        </ManageBarButton>
        {selectedCount === 1 && (
          <>
            <ManageBarButton
              type="button"
              $variant="download"
              onClick={onGoToDownload}
              title="下載全部"
              aria-label="下載全部"
            >
              <Download />
            </ManageBarButton>
            <ManageBarButton
              type="button"
              $variant="export"
              onClick={onGoToExport}
              title="匯出書籍"
              aria-label="匯出書籍"
            >
              <FileText />
            </ManageBarButton>
          </>
        )}
        <ManageBarButton
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
        </ManageBarButton>
        <ManageBarButton
          type="button"
          $variant="delete"
          disabled={selectedCount === 0}
          onClick={onBulkDelete}
          title={activeTab === ALL_TAB ? '刪除所選書籍' : '從收藏夾移除'}
          aria-label={activeTab === ALL_TAB ? '刪除所選書籍' : '從收藏夾移除'}
        >
          <Trash2 />
        </ManageBarButton>
      </ManageActionButtons>
    </ManageActionBarRoot>
  );
}

export default ManageActionBar;
