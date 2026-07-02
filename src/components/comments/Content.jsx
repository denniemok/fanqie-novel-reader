import { ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';
import { TopBarOffset } from '../common/PageContent';
import BookInfo from '../common/BookInfo';
import CommentsActionBar from './CommentsActionBar';
import CommentThread from './CommentThread';

const Section = styled.div`
  padding: 24px 24px 24px;

  @media (max-width: 480px) {
    padding: 20px 16px 16px;
  }
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

function CommentStatsHeading({ commentCnt, convertedContext }) {
  if (!(commentCnt > 0 || convertedContext)) return null;

  return (
    <SectionTitle>
      {commentCnt > 0 && <span>共 {commentCnt} 則評論</span>}
      {convertedContext && <span> · {convertedContext}</span>}
    </SectionTitle>
  );
}

const CommentList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  min-height: 44px;
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

function Content({
  bookId,
  bookInfo,
  comments,
  commentCnt,
  convertedContext,
  page,
  canGoPrev,
  canGoNext,
  onPrevPage,
  onNextPage,
  onRefresh,
  conversionMode,
}) {
  return (
    <TopBarOffset>
      {bookInfo && (
        <BookInfo bookInfo={bookInfo} conversionMode={conversionMode} />
      )}
      <CommentsActionBar bookId={bookId} onRefresh={onRefresh} />
      <Section>
        <CommentStatsHeading commentCnt={commentCnt} convertedContext={convertedContext} />
        {comments.length === 0 ? (
          <EmptyState>暫無評論</EmptyState>
        ) : (
          <CommentList>
              {comments.map((item, idx) => (
                <CommentThread
                  key={item.comment_id ?? idx}
                  comment={item}
                  conversionMode={conversionMode}
                />
              ))}
          </CommentList>
        )}
        <Pagination>
          <PaginationButton
            type="button"
            onClick={onPrevPage}
            disabled={!canGoPrev}
            title="上一頁"
          >
            <ChevronLeft size={18} />
          </PaginationButton>
          <PageInfo>第 {page} 頁</PageInfo>
          <PaginationButton
            type="button"
            onClick={onNextPage}
            disabled={!canGoNext}
            title="下一頁"
          >
            <ChevronRight size={18} />
          </PaginationButton>
        </Pagination>
      </Section>
    </TopBarOffset>
  );
}

export default Content;
