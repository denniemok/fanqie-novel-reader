import { Bookmark, Download, FileText, MessageCircle, RefreshCw } from 'lucide-react';
import BookActionBar from '../book/BookActionBar';
import LabeledIconButton from '../ui/LabeledIconButton';
import { CHAPTER_BUTTON_TITLE } from '../navigation/ChapterButton';
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
        label="查看評論"
        title="查看評論"
        onClick={() => navigate(buildCommentsUrl(bookId))}
      >
        <MessageCircle size={20} strokeWidth={2.5} />
      </LabeledIconButton>
      <LabeledIconButton
        type="button"
        label={CHAPTER_BUTTON_TITLE}
        title={CHAPTER_BUTTON_TITLE}
        disabled={!lastReadItemId}
        onClick={() => {
          if (!lastReadItemId) return;
          navigate(buildChapterUrl(lastReadItemId, bookId));
        }}
      >
        <Bookmark size={20} strokeWidth={2.5} />
      </LabeledIconButton>
    </BookActionBar>
  );
}

export default CatalogActionBar;
