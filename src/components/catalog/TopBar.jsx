import React from 'react';
import { Bookmark, Download, FileText, MessageCircle, RefreshCw } from 'lucide-react';
import TopBarBase from '../common/TopBarBase';
import HomeButton from '../common/HomeButton';
import BookshelfButton from '../common/BookshelfButton';
import { IconButton } from '../common/IconButton';
import { buildChapterUrl, buildCommentsUrl } from '../../utils/navigation';

function TopBar({
  bookId,
  navigate,
  hasUncachedChapters,
  uncachedItemIds,
  downloadingAll,
  onDownloadAll,
  onRefresh,
  onExportTxt,
  lastReadItemId,
}) {
  return (
    <TopBarBase pageTitle="目錄">
      <HomeButton />
      <BookshelfButton />
      <IconButton
        type="button"
        title={downloadingAll ? '停止下載' : hasUncachedChapters ? `下載全部 (${uncachedItemIds.length} 章)` : '已全部下載'}
        onClick={onDownloadAll}
        disabled={!hasUncachedChapters && !downloadingAll}
        $active={downloadingAll}
        aria-pressed={downloadingAll}
      >
        <Download size={20} strokeWidth={2.5} />
      </IconButton>
      <IconButton
        type="button"
        title="匯出 TXT"
        onClick={onExportTxt}
      >
        <FileText size={20} strokeWidth={2.5} />
      </IconButton>
      <IconButton
        type="button"
        title="刷新目錄"
        onClick={onRefresh}
      >
        <RefreshCw size={20} strokeWidth={2.5} />
      </IconButton>
      <IconButton
        type="button"
        title="評論"
        onClick={() => navigate(buildCommentsUrl(bookId))}
      >
        <MessageCircle size={20} strokeWidth={2.5} />
      </IconButton>
      {lastReadItemId && (
        <IconButton
          type="button"
          onClick={() => navigate(buildChapterUrl(lastReadItemId, bookId))}
          title="返回章節"
        >
          <Bookmark size={20} strokeWidth={2.5} />
        </IconButton>
      )}
    </TopBarBase>
  );
}

export default TopBar;
