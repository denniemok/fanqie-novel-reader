import { Bookmark, Download, FileText, MessageCircle, RefreshCw } from 'lucide-react';
import BookActionBar from '../common/BookActionBar';
import LabeledIconButton from '../common/LabeledIconButton';
import { buildChapterUrl, buildCommentsUrl } from '../../utils/navigation';

function CatalogActionBar({
  bookId,
  navigate,
  hasUncachedChapters,
  downloadingAll,
  onDownloadAll,
  onRefresh,
  onExportBook,
  lastReadItemId,
}) {
  const downloadText = downloadingAll ? '停止下載' : hasUncachedChapters ? '下載全部' : '已下載';

  return (
    <BookActionBar>
      <LabeledIconButton
        type="button"
        label={downloadText}
        title={downloadText}
        onClick={onDownloadAll}
        disabled={!hasUncachedChapters && !downloadingAll}
        $active={downloadingAll}
        aria-pressed={downloadingAll}
      >
        <Download size={20} strokeWidth={2.5} />
      </LabeledIconButton>
      <LabeledIconButton
        type="button"
        label="匯出書籍"
        title="匯出書籍"
        onClick={onExportBook}
      >
        <FileText size={20} strokeWidth={2.5} />
      </LabeledIconButton>
      <LabeledIconButton
        type="button"
        label="刷新目錄"
        title="刷新目錄"
        onClick={onRefresh}
      >
        <RefreshCw size={20} strokeWidth={2.5} />
      </LabeledIconButton>
      <LabeledIconButton
        type="button"
        label="評論"
        title="評論"
        onClick={() => navigate(buildCommentsUrl(bookId))}
      >
        <MessageCircle size={20} strokeWidth={2.5} />
      </LabeledIconButton>
      {lastReadItemId && (
        <LabeledIconButton
          type="button"
          label="返回章節"
          title="返回章節"
          onClick={() => navigate(buildChapterUrl(lastReadItemId, bookId))}
        >
          <Bookmark size={20} strokeWidth={2.5} />
        </LabeledIconButton>
      )}
    </BookActionBar>
  );
}

export default CatalogActionBar;
