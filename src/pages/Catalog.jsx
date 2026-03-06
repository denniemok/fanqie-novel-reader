import { useState } from 'react';
import { useSearchParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { Bookmark, CloudDownload, Download, Languages, RefreshCw } from 'lucide-react';
import Menu from '../components/Menu';
import Info from '../components/Info';
import Error from '../components/Error';
import MyHead from '../components/MyHead';
import Sort from '../components/Sort';
import LoadingPage from '../components/LoadingPage';
import HomeButton from '../components/HomeButton';
import { IconButton } from '../components/IconButton';
import styled from 'styled-components';
import { RightActions } from '../components/common/ActionBar';
import { buildChapterUrl } from '../utils/navigation';

const CatalogWrapper = styled.div`
  min-height: 100dvh;
  min-height: 100vh;
  overflow-x: hidden;
  width: 100%;
  background-color: var(--background-color);
  padding-bottom: env(safe-area-inset-bottom);
`;
import { getLastReadChapter, isChapterCached } from '../utils/storage';
import { useTraditionalChineseToggle } from '../hooks/useTraditionalChineseToggle';
import { useBookLoader } from '../hooks/useBookLoader';
import { useDownloadManager } from '../contexts/DownloadManager';
import { MAX_CONCURRENT_DOWNLOADS } from '../utils/constants';

const BackBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  padding-top: calc(16px + env(safe-area-inset-top));
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  @media (max-width: 480px) {
    padding: 12px 16px;
    padding-top: calc(12px + env(safe-area-inset-top));
  }
`;

const CatalogContent = styled.div`
  padding-top: calc(76px + env(safe-area-inset-top));

  @media (max-width: 480px) {
    padding-top: calc(68px + env(safe-area-inset-top));
  }
`;

const SiteTitle = styled(Link)`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    color: var(--accent-color);
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

function Catalog() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookId = searchParams.get('bookId');
  const lastReadItemId = bookId ? getLastReadChapter(bookId) : null;
  
  const { error, bookInfo, loadBook } = useBookLoader(bookId);
  const { addToQueue, isDownloading, startDownloadAll, stopDownloadAll, isDownloadingAll } = useDownloadManager();
  const [sortOrder, setSortOrder] = useState('ascending');
  const [useTraditionalChinese, toggleTraditionalChinese] = useTraditionalChineseToggle();

  const itemDataList = bookInfo?.item_data_list ?? [];
  const uncachedItemIds = itemDataList.filter((item) => !isChapterCached(item.item_id)).map((item) => item.item_id);
  const hasUncachedChapters = uncachedItemIds.length > 0;
  const anyDownloading = uncachedItemIds.some((id) => isDownloading(id));
  const batchSize = Math.min(MAX_CONCURRENT_DOWNLOADS, uncachedItemIds.length);
  const downloadingAll = isDownloadingAll(bookId);

  const handleBatchDownload = () => {
    const batch = uncachedItemIds.slice(0, MAX_CONCURRENT_DOWNLOADS);
    batch.forEach((itemId) => addToQueue(itemId, false));
  };

  const handleDownloadAll = () => {
    if (downloadingAll) {
      stopDownloadAll();
    } else {
      startDownloadAll(bookId, uncachedItemIds);
    }
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === 'ascending' ? 'descending' : 'ascending');
  };

  if (!bookId) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return <Error message={error} href="/" />;
  }

  return (
    <CatalogWrapper>
      <MyHead bookInfo={bookInfo} />
      {bookInfo && (
      <BackBar>
        <SiteTitle to="/">番茄小說閱讀器</SiteTitle>
        <RightActions>
          <HomeButton />
          <IconButton
            type="button"
            title={useTraditionalChinese ? '切換為簡體中文' : '切換為繁體中文'}
            onClick={toggleTraditionalChinese}
            style={useTraditionalChinese ? { color: 'var(--accent-color)' } : undefined}
          >
            <Languages size={20} strokeWidth={2.5} />
          </IconButton>
          <IconButton
            type="button"
            title={hasUncachedChapters ? `批次下載 (${batchSize} 章)` : '全部已下載'}
            onClick={handleBatchDownload}
            disabled={!hasUncachedChapters || anyDownloading || downloadingAll}
          >
            <Download size={20} strokeWidth={2.5} />
          </IconButton>
          <IconButton
            type="button"
            title={downloadingAll ? '停止下載全部' : hasUncachedChapters ? `下載全部 (${uncachedItemIds.length} 章)` : '全部已下載'}
            onClick={handleDownloadAll}
            disabled={!hasUncachedChapters && !downloadingAll}
            style={downloadingAll ? { color: 'var(--accent-color)' } : undefined}
          >
            <CloudDownload size={20} strokeWidth={2.5} />
          </IconButton>
          <IconButton
            type="button"
            title="重新載入目錄"
            onClick={() => loadBook(true)}
          >
            <RefreshCw size={20} strokeWidth={2.5} />
          </IconButton>
          {lastReadItemId && (
            <IconButton
              type="button"
              onClick={() => navigate(buildChapterUrl(lastReadItemId, bookId))}
              title="返回章節"
            >
              <Bookmark size={20} strokeWidth={2} />
            </IconButton>
          )}
        </RightActions>
      </BackBar>
      )}
      {bookInfo ? (
        <CatalogContent>
          <Info bookInfo={bookInfo} useTraditionalChinese={useTraditionalChinese} />
          {bookInfo.item_data_list && (
            <>
              <Sort sortOrder={sortOrder} onSortChange={handleSortChange} />
              <Menu sortOrder={sortOrder} itemDataList={bookInfo.item_data_list} bookId={bookId} useTraditionalChinese={useTraditionalChinese} />
            </>
          )}
        </CatalogContent>
      ) : (
        <LoadingPage onAbort={() => navigate('/')} />
      )}
    </CatalogWrapper>
  );
}

export default Catalog;
