import { Download, FileText, MessageCircle, RefreshCw } from 'lucide-react';
import BookToolButton from '../book/BookToolButton';
import { buildCommentsUrl } from '../../utils/navigation';

/** Secondary book tools; rendered after the read button inside BookInfo's action row. */
function CatalogActionBar({
  bookId,
  navigate,
  hasUncachedChapters,
  downloadingAll,
  onDownloadAll,
  onRefresh,
  onExportBook,
}) {
  const downloadText = downloadingAll ? '停止下載' : hasUncachedChapters ? '下載全部' : '已下載';

  return (
    <>
      <BookToolButton
        icon={Download}
        label={downloadText}
        onClick={onDownloadAll}
        disabled={!hasUncachedChapters && !downloadingAll}
        $active={downloadingAll}
        aria-pressed={downloadingAll}
      />
      <BookToolButton icon={FileText} label="匯出書籍" onClick={onExportBook} />
      <BookToolButton icon={RefreshCw} label="刷新目錄" onClick={onRefresh} />
      <BookToolButton icon={MessageCircle} label="查看評論" onClick={() => navigate(buildCommentsUrl(bookId))} />
    </>
  );
}

export default CatalogActionBar;
