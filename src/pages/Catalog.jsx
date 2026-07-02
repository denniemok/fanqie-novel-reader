import { useState, useEffect } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import Menu from '../components/catalog/Menu';
import BookInfo from '../components/common/BookInfo';
import Error from '../components/common/Error';
import Loading from '../components/common/Loading';
import PageWrapper from '../components/common/PageWrapper';
import { useToast } from '../contexts/ToastContext';
import TopBar from '../components/catalog/TopBar';
import { TopBarOffset } from '../components/common/PageContent';
import { getLastReadChapter, getSortOrder, setSortOrder, getUncachedItemIds } from '../utils/storage';
import { runBookTxtExport } from '../utils/exportBookActions';
import { useConversionMode } from '../hooks/useConversionMode';
import { useBookLoader } from '../hooks/useBookLoader';
import { useDownloadManager } from '../contexts/DownloadManager';
import { CHAPTERS_PER_PAGE, getTotalPages } from '../utils/catalogPagination';
import { buildCatalogUrl, ROUTES } from '../utils/navigation';
import DownloadAllConfirmModal from '../components/catalog/DownloadAllConfirmModal';
import { useErrorToast } from '../hooks/useErrorToast';

function Catalog() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookId = searchParams.get('bookId');
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const [lastReadItemId, setLastReadItemId] = useState(null);

  const { error, bookInfo, loadBook } = useBookLoader(bookId);
  const { startDownloadAll, stopDownloadAll, isDownloadingAll, completedDownloads } = useDownloadManager();
  const { showToast } = useToast();
  const [sortOrder, setSortOrderState] = useState(getSortOrder);
  const [conversionMode] = useConversionMode();
  const [, setCatalogRefresh] = useState(0);
  const [uncachedItemIds, setUncachedItemIds] = useState([]);
  const [downloadAllConfirmOpen, setDownloadAllConfirmOpen] = useState(false);
  const onChapterDeleted = (itemId) => {
    if (itemId) setUncachedItemIds((prev) => prev.filter((id) => id !== itemId));
    setCatalogRefresh((k) => k + 1);
  };

  const itemDataList = bookInfo?.item_data_list ?? [];
  const totalChapters = itemDataList.length;
  const totalPages = getTotalPages(totalChapters, CHAPTERS_PER_PAGE);
  const safePageParam = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const currentPage = Math.min(safePageParam, totalPages) - 1;

  useEffect(() => {
    if (!bookId) {
      setLastReadItemId(null);
      return;
    }
    getLastReadChapter(bookId).then(setLastReadItemId);
  }, [bookId]);

  useEffect(() => {
    if (!bookInfo || safePageParam <= totalPages) return;
    navigate(buildCatalogUrl(bookId, totalPages), { replace: true });
  }, [bookInfo, bookId, safePageParam, totalPages, navigate]);

  useEffect(() => {
    const list = bookInfo?.item_data_list;
    if (!list?.length) {
      setUncachedItemIds((prev) => (prev.length ? [] : prev));
      return;
    }
    getUncachedItemIds(list.map((item) => item.item_id)).then(setUncachedItemIds);
  }, [bookInfo, completedDownloads]);

  useErrorToast(error);
  const hasUncachedChapters = uncachedItemIds.length > 0;
  const downloadingAll = isDownloadingAll(bookId);

  const goToPage = (pageIndex) => {
    navigate(buildCatalogUrl(bookId, pageIndex + 1));
  };

  const handleDownloadAll = () => {
    if (downloadingAll) {
      stopDownloadAll();
      return;
    }
    setDownloadAllConfirmOpen(true);
  };

  const handleStartDownloadAll = (navigateToDownloadPage) => {
    startDownloadAll(bookId, uncachedItemIds);
    setDownloadAllConfirmOpen(false);
    if (navigateToDownloadPage) {
      navigate(ROUTES.download);
    }
  };

  const handleSortChange = () => {
    const next = sortOrder === 'ascending' ? 'descending' : 'ascending';
    setSortOrder(next);
    setSortOrderState(next);
    navigate(buildCatalogUrl(bookId));
  };

  const handleExportTxt = () => {
    runBookTxtExport({ bookId, bookInfo, showToast });
  };

  if (!bookId) {
    return <Navigate to={ROUTES.home} replace />;
  }

  if (error) {
    return <Error message={error} href={ROUTES.home} />;
  }

  return (
    <PageWrapper>
      {bookInfo && (
        <TopBar
          bookId={bookId}
          navigate={navigate}
          hasUncachedChapters={hasUncachedChapters}
          uncachedItemIds={uncachedItemIds}
          downloadingAll={downloadingAll}
          onDownloadAll={handleDownloadAll}
          onRefresh={() => loadBook(true)}
          onExportTxt={handleExportTxt}
          lastReadItemId={lastReadItemId}
        />
      )}
      {bookInfo ? (
        <TopBarOffset>
          <BookInfo bookInfo={bookInfo} conversionMode={conversionMode} />
          {bookInfo.item_data_list && (
            <Menu
              sortOrder={sortOrder}
              itemDataList={bookInfo.item_data_list}
              bookId={bookId}
              conversionMode={conversionMode}
              onChapterDeleted={onChapterDeleted}
              currentPage={currentPage}
              chaptersPerPage={CHAPTERS_PER_PAGE}
              onPagePrev={() => goToPage(Math.max(0, currentPage - 1))}
              onPageNext={() => goToPage(Math.min(totalPages - 1, currentPage + 1))}
              onPageSelect={goToPage}
              onSortChange={handleSortChange}
            />
          )}
        </TopBarOffset>
      ) : (
        <Loading onAbort={() => navigate(ROUTES.home)} />
      )}
      {downloadAllConfirmOpen && (
        <DownloadAllConfirmModal
          chapterCount={uncachedItemIds.length}
          onStay={() => handleStartDownloadAll(false)}
          onGoToDownloadPage={() => handleStartDownloadAll(true)}
          onClose={() => setDownloadAllConfirmOpen(false)}
        />
      )}
    </PageWrapper>
  );
}

export default Catalog;
