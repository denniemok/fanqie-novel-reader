import { useState, useEffect } from 'react';
import { useSearchParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Languages, List, RefreshCw } from 'lucide-react';
import styled from 'styled-components';
import { fetchComments, fetchBookDetail } from '../api';
import { buildCatalogUrl } from '../utils/navigation';
import Error from '../components/Error';
import Info from '../components/Info';
import LoadingPage from '../components/LoadingPage';
import HomeButton from '../components/HomeButton';
import MyHead from '../components/MyHead';
import { IconButton } from '../components/IconButton';
import { RightActions } from '../components/common/ActionBar';
import { useTraditionalChineseToggle } from '../hooks/useTraditionalChineseToggle';
import { useConvertedText } from '../hooks/useConvertedText';
import { maybeConvert } from '../utils/zh-convert';

const COMMENTS_PER_PAGE = 20;

const CommentsWrapper = styled.div`
  min-height: 100dvh;
  min-height: 100vh;
  overflow-x: hidden;
  width: 100%;
  background-color: var(--background-color);
  padding-bottom: env(safe-area-inset-bottom);
`;

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

const PageContent = styled.div`
  padding-top: calc(76px + env(safe-area-inset-top));

  @media (max-width: 480px) {
    padding-top: calc(68px + env(safe-area-inset-top));
  }
`;

const CommentsSection = styled.div`
  padding: 24px 24px 24px;

  @media (max-width: 480px) {
    padding: 20px 16px 16px;
  }
`;

const CommentStats = styled.div`
  font-size: 14px;
  color: var(--text-color-secondary);
`;

const SectionTitle = styled.h1`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-color);
  margin: 10px 0 24px;

  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 20px;
  }
`;

const CommentList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CommentItem = styled.li`
  padding: 16px;
  background-color: var(--background-color2);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-color);
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const CommentUser = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--accent-color);
`;

const CommentScore = styled.span`
  font-size: 12px;
  color: var(--text-color-secondary);
`;

const CommentText = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-color);
  white-space: pre-wrap;
  word-break: break-word;
`;


const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
  padding: 16px 0;
`;

const PaginationButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--background-color2);
  color: var(--text-color);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: var(--hover-background-color);
    border-color: var(--accent-color);
    color: var(--accent-color);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: var(--text-color-secondary);
`;

const EmptyState = styled.p`
  text-align: center;
  color: var(--text-color-secondary);
  font-size: 15px;
  padding: 40px 24px;
  margin: 0;
`;

function Comments() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookId = searchParams.get('bookId');
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const page = Math.max(1, pageParam);
  const [useTraditionalChinese, toggleTraditionalChinese] = useTraditionalChineseToggle();

  const [data, setData] = useState(null);
  const [bookDetail, setBookDetail] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const offset = (page - 1) * COMMENTS_PER_PAGE + 1;
  const innerData = data?.data ?? {};

  useEffect(() => {
    if (!bookId) return;

    setLoading(true);
    setError(null);
    Promise.all([
      fetchComments(bookId, { count: COMMENTS_PER_PAGE, offset }),
      fetchBookDetail(bookId).catch(() => null),
    ])
      .then(([commentsRes, detail]) => {
        setData(commentsRes);
        setBookDetail(detail);
      })
      .catch((err) => {
        setError(err?.message || 'Failed to fetch comments');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [bookId, offset, refreshKey]);

  const comments = innerData.comment ?? [];
  const commentCnt = innerData.comment_cnt ?? 0;
  const context = innerData.context ?? '';
  const hasMore = innerData.has_more ?? false;
  const canGoNext = hasMore;
  const canGoPrev = page > 1;

  const convertedContext = useConvertedText(context, useTraditionalChinese);

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
    <CommentsWrapper>
      <MyHead bookInfo={bookDetail ? { book_info: bookDetail } : undefined} />
      {loading ? (
        <LoadingPage onAbort={() => navigate(buildCatalogUrl(bookId))} />
      ) : (
        <>
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
            title="重新載入評論"
            onClick={handleRefresh}
          >
            <RefreshCw size={20} strokeWidth={2.5} />
          </IconButton>
          <IconButton
            type="button"
            title="目錄"
            onClick={() => navigate(buildCatalogUrl(bookId))}
          >
            <List size={20} strokeWidth={2.5} />
          </IconButton>
        </RightActions>
      </BackBar>
        <PageContent>
          {bookDetail && (
            <Info
              bookInfo={bookDetail}
              useTraditionalChinese={useTraditionalChinese}
            />
          )}
          <CommentsSection>
          <SectionTitle>
            評論
            {(commentCnt > 0 || context) && (
              <CommentStats>
                {commentCnt > 0 && <span>共 {commentCnt} 則評論</span>}
                {context && <span> · {convertedContext}</span>}
              </CommentStats>
            )}
          </SectionTitle>
          {comments.length === 0 ? (
            <EmptyState>暫無評論</EmptyState>
          ) : (
            <>
              {!bookDetail && (commentCnt > 0 || context) && (
                <CommentStats style={{ marginBottom: 16 }}>
                  {commentCnt > 0 && <span>共 {commentCnt} 則評論</span>}
                  {context && <span> · {convertedContext}</span>}
                </CommentStats>
              )}
              <CommentList>
                {comments.map((item, idx) => {
                  const user = item.user_info?.user_name ?? '匿名';
                  const score = item.score ?? '';
                  const text = item.text ?? '';
                  
                  const convertedUser = maybeConvert(user, useTraditionalChinese);
                  const convertedText = maybeConvert(text, useTraditionalChinese);

                  return (
                    <CommentItem key={item.comment_id ?? idx}>
                      <CommentHeader>
                        <CommentUser>{convertedUser}</CommentUser>
                        {score && <CommentScore>評分: {score}</CommentScore>}
                      </CommentHeader>
                      <CommentText>{convertedText}</CommentText>
                    </CommentItem>
                  );
                })}
              </CommentList>
            </>
          )}
          <Pagination>
            <PaginationButton
              type="button"
              onClick={handlePrevPage}
              disabled={!canGoPrev}
              title="上一頁"
            >
              <ChevronLeft size={18} />
            </PaginationButton>
            <PageInfo>第 {page} 頁</PageInfo>
            <PaginationButton
              type="button"
              onClick={handleNextPage}
              disabled={!canGoNext}
              title="下一頁"
            >
              <ChevronRight size={18} />
            </PaginationButton>
          </Pagination>
          </CommentsSection>
        </PageContent>
        </>
      )}
    </CommentsWrapper>
  );
}

export default Comments;
