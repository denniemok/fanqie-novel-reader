import { useState, useEffect, useLayoutEffect } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { fetchComments } from '../services/api';
import { useBookLoader } from '../hooks/book/useBookLoader';
import { buildCatalogUrl, buildCommentsUrl, ROUTES } from '../utils/navigation';
import { formatErrorMessage } from '../utils/errors';
import Error from '../components/ui/Error';
import Loading from '../components/ui/Loading';
import PageWrapper from '../components/layout/PageWrapper';
import NavTopBar from '../components/layout/NavTopBar';
import CommentsContent from '../components/comments/CommentsContent';
import { useConversionMode } from '../hooks/useConversionMode';
import { useConvertedText } from '../hooks/useConvertedText';
import { useErrorToast } from '../hooks/useErrorToast';

function Comments() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookId = searchParams.get('bookId');
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const page = Math.max(1, pageParam);
  const [conversionMode] = useConversionMode();

  const { error: bookError, bookInfo } = useBookLoader(bookId, { detailOnly: true });
  const [data, setData] = useState(null);
  const [commentsError, setCommentsError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const error = bookError || commentsError;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    if (!bookId) return;

    const controller = new AbortController();
    setLoading(true);
    setCommentsError(null);
    fetchComments(bookId, { page, signal: controller.signal })
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('獲取評論失敗：', bookId, err);
        setCommentsError(formatErrorMessage(err, '獲取評論失敗，請稍後再試。'));
        setLoading(false);
      });
    return () => controller.abort();
  }, [bookId, page, refreshKey]);

  const comments = data?.comment ?? [];
  const commentCnt = data?.comment_cnt ?? 0;
  const context = data?.context ?? '';
  const hasMore = data?.has_more ?? false;
  const canGoNext = hasMore;
  const canGoPrev = page > 1;

  const convertedContext = useConvertedText(context, conversionMode);

  useErrorToast(error);

  const handlePrevPage = () => {
    if (!canGoPrev) return;
    window.scrollTo(0, 0);
    navigate(buildCommentsUrl(bookId, page - 1));
  };

  const handleNextPage = () => {
    if (!canGoNext) return;
    window.scrollTo(0, 0);
    navigate(buildCommentsUrl(bookId, page + 1));
  };

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  if (!bookId) {
    return <Navigate to={ROUTES.home} replace />;
  }

  if (error) {
    return <Error message={error} href={buildCatalogUrl(bookId)} />;
  }

  const isInitialLoad = loading && data === null;

  return (
    <PageWrapper>
      {isInitialLoad ? (
        <Loading onAbort={() => navigate(buildCatalogUrl(bookId))} />
      ) : (
        <>
          <NavTopBar pageTitle="評論" navVariant="comments" bookId={bookId} />
          <CommentsContent
            bookId={bookId}
            bookInfo={bookInfo}
            comments={comments}
            commentCnt={commentCnt}
            convertedContext={convertedContext}
            page={page}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            onRefresh={handleRefresh}
            conversionMode={conversionMode}
            pageLoading={loading}
          />
        </>
      )}
    </PageWrapper>
  );
}

export default Comments;
