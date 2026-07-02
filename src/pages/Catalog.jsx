import { useState, useEffect } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import CatalogChapterList from '../components/catalog/CatalogChapterList';
import BookInfo from '../components/book/BookInfo';
import Error from '../components/ui/Error';
import Loading from '../components/ui/Loading';
import PageWrapper from '../components/layout/PageWrapper';
import { useToast } from '../contexts/ToastContext';
import NavTopBar from '../components/layout/NavTopBar';
import CatalogActionBar from '../components/catalog/CatalogActionBar';
import { TopBarOffset } from '../components/layout/PageContent';
import { getLastReadChapter, getCatalogSortDirection, setCatalogSortDirection, getUncachedItemIds } from '../utils/storage';
import { useConversionMode } from '../hooks/useConversionMode';
import { useBookDisplayVariant } from '../contexts/BookDisplayVariantContext';
import { useBookLoader } from '../hooks/book/useBookLoader';
import { useDownloadManager } from '../contexts/DownloadManager';
import { CHAPTERS_PER_PAGE, getTotalPages } from '../utils/book/catalogPagination';
import { buildCatalogUrl, ROUTES } from '../utils/navigation';
import DownloadAllConfirmModal from '../components/catalog/DownloadAllConfirmModal';
import ExportBookModalHost from '../components/export/ExportBookModalHost';
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
  const [sortOrder, setSortOrderState] = useState(getCatalogSortDirection);
  const [conversionMode] = useConversionMode();
  const { variant: displayVariant } = useBookDisplayVariant();
  const [, setCatalogRefresh] = useState(0);
  const [uncachedItemIds, setUncachedItemIds] = useState([]);
  const [downloadAllConfirmOpen, setDownloadAllConfirmOpen] = useState(false);
  const [exportBookOpen, setExportBookOpen] = useState(false);
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
    setCatalogSortDirection(next);
    setSortOrderState(next);
    navigate(buildCatalogUrl(bookId));
  };

  const handleExportBook = () => {
    setExportBookOpen(true);
  };

  if (!bookId) {
    return <Navigate to={ROUTES.home} replace />;
  }

  if (error) {
    return <Error message={error} href={ROUTES.home} />;
  }

  return (
    <PageWrapper>
      {bookInfo && <NavTopBar pageTitle="目錄" />}
      {bookInfo ? (
        <TopBarOffset>
          <BookInfo bookInfo={bookInfo} conversionMode={conversionMode} />
          <CatalogActionBar
            bookId={bookId}
            navigate={navigate}
            hasUncachedChapters={hasUncachedChapters}
            downloadingAll={downloadingAll}
            onDownloadAll={handleDownloadAll}
            onRefresh={() => loadBook(true)}
            onExportBook={handleExportBook}
            lastReadItemId={lastReadItemId}
          />
          {bookInfo.item_data_list && (
            <CatalogChapterList
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
      <ExportBookModalHost
        open={exportBookOpen}
        bookId={bookId}
        bookInfo={bookInfo}
        defaultSortOrder={sortOrder}
        defaultConversionMode={conversionMode}
        defaultDisplayVariant={displayVariant}
        showToast={showToast}
        onClose={() => setExportBookOpen(false)}
      />
    </PageWrapper>
  );
}

export default Catalog;
