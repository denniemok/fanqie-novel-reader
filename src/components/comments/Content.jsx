import { ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';
import { TopBarOffset } from '../common/PageContent';
import Info from '../book/Info';
import { maybeConvert } from '../../utils/zh-convert';

const Section = styled.div`
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
  bookInfo,
  comments,
  commentCnt,
  context,
  convertedContext,
  page,
  canGoPrev,
  canGoNext,
  onPrevPage,
  onNextPage,
  conversionMode,
}) {
  return (
    <TopBarOffset>
      {bookInfo && (
        <Info bookInfo={bookInfo} conversionMode={conversionMode} />
      )}
      <Section>
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
            {!bookInfo && (commentCnt > 0 || context) && (
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

                const convertedUser = maybeConvert(user, conversionMode);
                const convertedText = maybeConvert(text, conversionMode);

                return (
                  <CommentItem key={item.comment_id ?? idx}>
                    <CommentHeader>
                      <CommentUser>{convertedUser}</CommentUser>
                      {score !== undefined &&
                        score !== null &&
                        score !== '' && (
                          <CommentScore>
                            評分: {score === '0' || score === 0 ? '暫無' : score}
                          </CommentScore>
                        )}
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
