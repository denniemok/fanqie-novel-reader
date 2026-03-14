import { useState, useEffect } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { fetchComments } from '../services/api';
import { useBookLoader } from '../hooks/useBookLoader';
import { buildCatalogUrl } from '../utils/navigation';
import { formatErrorMessage } from '../utils/errors';
import { useToast } from '../contexts/ToastContext';
import Error from '../components/common/Error';
import Loading from '../components/common/Loading';
import PageWrapper from '../components/common/PageWrapper';
import TopBar from '../components/comments/TopBar';
import Content from '../components/comments/Content';
import { useConversionMode } from '../hooks/useConversionMode';
import { useConvertedText } from '../hooks/useConvertedText';

const COMMENTS_PER_PAGE = 20;

function Comments() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookId = searchParams.get('bookId');
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const page = Math.max(1, pageParam);
  const [conversionMode, setConversionMode] = useConversionMode();

  const { error: bookError, bookInfo } = useBookLoader(bookId, { detailOnly: true });
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [commentsError, setCommentsError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const offset = (page - 1) * COMMENTS_PER_PAGE + 1;
  const innerData = data?.data ?? {};
  const error = bookError || commentsError;

  useEffect(() => {
    if (!bookId) return;

    const controller = new AbortController();
    setLoading(true);
    setCommentsError(null);
    fetchComments(bookId, { count: COMMENTS_PER_PAGE, offset, signal: controller.signal })
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
  }, [bookId, offset, refreshKey]);

  const comments = innerData.comment ?? [];
  const commentCnt = innerData.comment_cnt ?? 0;
  const context = innerData.context ?? '';
  const hasMore = innerData.has_more ?? false;
  const canGoNext = hasMore;
  const canGoPrev = page > 1;

  const convertedContext = useConvertedText(context, conversionMode);

  useEffect(() => {
    if (error) showToast(error);
  }, [error, showToast]);

  const handlePrevPage = () => {
    if (canGoPrev) {
      const params = new URLSearchParams(searchParams);
      params.set('page', String(page - 1));
      navigate(`/comments?${params.toString()}`);
    }
  };

  const handleNextPage = () => {
    if (canGoNext) {
      const params = new URLSearchParams(searchParams);
      params.set('page', String(page + 1));
      navigate(`/comments?${params.toString()}`);
    }
  };

  const handleRefresh = () => setRefreshKey((k) => k + 1);

  if (!bookId) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return <Error message={error} href={buildCatalogUrl(bookId)} />;
  }

  return (
    <PageWrapper>
      {loading ? (
        <Loading onAbort={() => navigate(buildCatalogUrl(bookId))} />
      ) : (
        <>
          <TopBar
            bookId={bookId}
            conversionMode={conversionMode}
            onConversionModeChange={setConversionMode}
            onRefresh={handleRefresh}
          />
          <Content
            bookInfo={bookInfo}
            comments={comments}
            commentCnt={commentCnt}
            context={context}
            convertedContext={convertedContext}
            page={page}
            canGoPrev={canGoPrev}
            canGoNext={canGoNext}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
            conversionMode={conversionMode}
          />
        </>
      )}
    </PageWrapper>
  );
}

export default Comments;
