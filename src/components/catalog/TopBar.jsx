import React from 'react';
import { ArrowUpDown, Bookmark, ChevronLeft, ChevronRight, CloudDownload, Download, FileText, MessageCircle, RefreshCw } from 'lucide-react';
import TopBarBase from '../common/TopBarBase';
import HomeButton from '../common/HomeButton';
import ApiSourceDropdown from '../common/ApiSourceDropdown';
import ConversionDropdown from '../common/ConversionDropdown';
import { IconButton } from '../common/IconButton';
import { buildChapterUrl, buildCommentsUrl } from '../../utils/navigation';

function TopBar({
  bookId,
  navigate,
  conversionMode,
  onConversionModeChange,
  sortOrder,
  onSortChange,
  hasUncachedChapters,
  batchSize,
  uncachedItemIds,
  anyDownloading,
  downloadingAll,
  onBatchDownload,
  onDownloadAll,
  onRefresh,
  onExportTxt,
  lastReadItemId,
  currentPage = 0,
  totalPages = 1,
  canGoPrev = false,
  canGoNext = false,
  onPagePrev = () => {},
  onPageNext = () => {},
}) {
  return (
    <TopBarBase>
      <HomeButton />
      <ApiSourceDropdown />
      {totalPages > 1 && (
        <IconButton
          type="button"
          title={`上一頁 (${currentPage + 1}/${totalPages})`}
          onClick={onPagePrev}
          disabled={!canGoPrev}
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </IconButton>
      )}
      {totalPages > 1 && (
        <IconButton
          type="button"
          title={`下一頁 (${currentPage + 1}/${totalPages})`}
          onClick={onPageNext}
          disabled={!canGoNext}
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </IconButton>
      )}
      <IconButton
        type="button"
        title={sortOrder === 'ascending' ? '升序排列 (點擊切換為降序)' : '降序排列 (點擊切換為升序)'}
        onClick={onSortChange}
        style={sortOrder === 'descending' ? { color: 'var(--accent-color)' } : undefined}
      >
        <ArrowUpDown size={20} strokeWidth={2.5} />
      </IconButton>
      <ConversionDropdown value={conversionMode} onChange={onConversionModeChange} />
      <IconButton
        type="button"
        title={hasUncachedChapters ? `批次下載 (${batchSize} 章)` : '全部已下載'}
        onClick={onBatchDownload}
        disabled={!hasUncachedChapters || anyDownloading || downloadingAll}
      >
        <Download size={20} strokeWidth={2.5} />
      </IconButton>
      <IconButton
        type="button"
        title={downloadingAll ? '停止下載全部' : hasUncachedChapters ? `下載全部 (${uncachedItemIds.length} 章)` : '全部已下載'}
        onClick={onDownloadAll}
        disabled={!hasUncachedChapters && !downloadingAll}
        style={downloadingAll ? { color: 'var(--accent-color)' } : undefined}
      >
        <CloudDownload size={20} strokeWidth={2.5} />
      </IconButton>
      <IconButton
        type="button"
        title="匯出為 TXT（僅包含已下載章節）"
        onClick={onExportTxt}
      >
        <FileText size={20} strokeWidth={2.5} />
      </IconButton>
      <IconButton
        type="button"
        title="評論"
        onClick={() => navigate(buildCommentsUrl(bookId))}
      >
        <MessageCircle size={20} strokeWidth={2.5} />
      </IconButton>
      <IconButton
        type="button"
        title="重新載入目錄"
        onClick={onRefresh}
      >
        <RefreshCw size={20} strokeWidth={2.5} />
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
