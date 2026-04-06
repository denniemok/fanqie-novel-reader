import { useState, useEffect } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import Menu from '../components/catalog/Menu';
import Info from '../components/book/Info';
import Error from '../components/common/Error';
import Loading from '../components/common/Loading';
import PageWrapper from '../components/common/PageWrapper';
import { useToast } from '../contexts/ToastContext';
import TopBar from '../components/catalog/TopBar';
import styled from 'styled-components';
import { getLastReadChapter, getSortOrder, setSortOrder, isChapterCached } from '../utils/storage';
import { sortChaptersByNumber } from '../utils/sorting';
import { exportBookToTxt } from '../utils/exportBookTxt';
import { useConversionMode } from '../hooks/useConversionMode';
import { useBookLoader } from '../hooks/useBookLoader';
import { useDownloadManager } from '../contexts/DownloadManager';
const CHAPTERS_PER_PAGE = 50;

const Content = styled.div`
  padding-top: calc(76px + env(safe-area-inset-top));

  @media (max-width: 480px) {
    padding-top: calc(68px + env(safe-area-inset-top));
  }
`;

function Catalog() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookId = searchParams.get('bookId');
  const lastReadItemId = bookId ? getLastReadChapter(bookId) : null;
  
  const { error, bookInfo, loadBook } = useBookLoader(bookId);
  const { startDownloadAll, stopDownloadAll, isDownloadingAll, completedDownloads } = useDownloadManager();
  const { showToast } = useToast();
  const [sortOrder, setSortOrderState] = useState(getSortOrder);
  const [conversionMode, setConversionMode] = useConversionMode();
  const [, setCatalogRefresh] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [uncachedItemIds, setUncachedItemIds] = useState([]);
  const onChapterDeleted = (itemId) => {
    if (itemId) setUncachedItemIds((prev) => prev.filter((id) => id !== itemId));
    setCatalogRefresh((k) => k + 1);
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [bookId]);

  const itemDataList = bookInfo?.item_data_list ?? [];
  const totalChapters = itemDataList.length;
  const totalPages = Math.max(1, Math.ceil(totalChapters / CHAPTERS_PER_PAGE));

  useEffect(() => {
    const list = bookInfo?.item_data_list;
    if (!list?.length) {
      setUncachedItemIds((prev) => (prev.length ? [] : prev));
      return;
    }
    Promise.all(list.map((item) => isChapterCached(item.item_id).then((cached) => ({ itemId: item.item_id, cached }))))
      .then((results) => setUncachedItemIds(results.filter((r) => !r.cached).map((r) => r.itemId)));
  }, [bookInfo, completedDownloads]);

  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (error) showToast(error);
  }, [error, showToast]);
  const hasUncachedChapters = uncachedItemIds.length > 0;
  const downloadingAll = isDownloadingAll(bookId);

  const handleDownloadAll = () => {
    if (downloadingAll) {
      stopDownloadAll();
    } else {
      startDownloadAll(bookId, uncachedItemIds);
    }
  };

  const handleSortChange = () => {
    const next = sortOrder === 'ascending' ? 'descending' : 'ascending';
    setSortOrder(next);
    setSortOrderState(next);
    setCurrentPage(0);
  };

  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  const handleExportTxt = async () => {
    const list = bookInfo?.item_data_list ?? [];
    const sorted = sortChaptersByNumber(list, sortOrder);
    const result = await exportBookToTxt({
      bookId,
      bookInfo,
      itemDataList: sorted,
      conversionMode,
    });
    if (result?.exportedCount === 0) {
      showToast('沒有已下載的章節，無法匯出正文。請先下載章節。');
    }
  };

  if (!bookId) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return <Error message={error} href="/" />;
  }

  return (
    <PageWrapper>
      {bookInfo && (
        <TopBar
          bookId={bookId}
          navigate={navigate}
          conversionMode={conversionMode}
          onConversionModeChange={setConversionMode}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          hasUncachedChapters={hasUncachedChapters}
          uncachedItemIds={uncachedItemIds}
          downloadingAll={downloadingAll}
          onDownloadAll={handleDownloadAll}
          onRefresh={() => loadBook(true)}
          onExportTxt={handleExportTxt}
          lastReadItemId={lastReadItemId}
          currentPage={currentPage}
          totalPages={totalPages}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
          onPagePrev={() => setCurrentPage((p) => Math.max(0, p - 1))}
          onPageNext={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
        />
      )}
      {bookInfo ? (
        <Content>
          <Info bookInfo={bookInfo} conversionMode={conversionMode} />
          {bookInfo.item_data_list && (
            <Menu sortOrder={sortOrder} itemDataList={bookInfo.item_data_list} bookId={bookId} conversionMode={conversionMode} onChapterDeleted={onChapterDeleted} currentPage={currentPage} chaptersPerPage={CHAPTERS_PER_PAGE} />
          )}
        </Content>
      ) : (
        <Loading onAbort={() => navigate('/')} />
      )}
    </PageWrapper>
  );
}

export default Catalog;
