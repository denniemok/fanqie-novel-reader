import { MessageCircle, Star, ThumbsUp } from 'lucide-react';
import styled from 'styled-components';
import { formatTimestamp, toDateTimeAttr } from '../../utils/datetime';
import { maybeConvert } from '../../utils/text/zh-convert';
import { getHiddenReplyCount, organizeReplies } from '../../utils/commentReplies';

const ThreadItem = styled.li`
  padding: 20px 22px;
  background: var(--card-surface);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius);
  color: var(--text-color);

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const CommentHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0px;
  margin-bottom: 8px;
`;

const CommentHeaderRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const CommentUser = styled.span`
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--text-color);
`;

const HeaderStats = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const ScoreBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--accent-color);
  padding: 2px 8px;
  background: var(--accent-soft);
  border-radius: var(--border-radius-xs);
  line-height: 1.2;
  white-space: nowrap;

  svg {
    width: 12px;
    height: 12px;
    flex-shrink: 0;
  }
`;

const MetaStat = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-color-secondary);
  white-space: nowrap;

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    opacity: 0.85;
  }
`;

const CommentDate = styled.time`
  font-size: 12px;
  font-weight: 500;
  color: var(--text-color-secondary);
  white-space: nowrap;
`;

const CommentText = styled.div`
  font-size: 15px;
  font-weight: 400;
  line-height: 1.85;
  letter-spacing: 0.02em;
  color: var(--text-color);
  white-space: pre-wrap;
  word-break: break-word;
`;

const ReplyList = styled.ul`
  list-style: none;
  margin: 14px 0 0;
  padding: 0 0 0 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-left: 1px solid var(--border-strong);
`;

const ReplyItem = styled.li`
  padding: 12px 14px;
  background: color-mix(in srgb, var(--text-color) 3%, transparent);
  border-radius: var(--border-radius-sm);
`;

const HiddenReplyHint = styled.p`
  margin: 10px 0 0;
  padding-left: 14px;
  font-size: 13px;
  color: var(--text-color-secondary);
`;

function formatScore(score) {
  if (score === undefined || score === null || score === '') return null;
  return score === '0' || score === 0 ? '暫無' : score;
}

function formatDiggCount(count) {
  const n = Number(count);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function Stat({ icon: Icon, value, label }) {
  return (
    <MetaStat title={label} aria-label={`${label} ${value}`}>
      <Icon size={14} strokeWidth={2.25} aria-hidden />
      <span>{value}</span>
    </MetaStat>
  );
}

function ReplyBlock({ reply, conversionMode }) {
  const user = reply.user_info?.user_name ?? '匿名';
  const text = reply.text ?? '';
  const convertedUser = maybeConvert(user, conversionMode);
  const convertedText = maybeConvert(text, conversionMode);
  const diggCount = formatDiggCount(reply.digg_count);
  const postedAt = formatTimestamp(reply.create_timestamp);
  const children = reply.children ?? [];

  return (
    <ReplyItem>
      <CommentHeader>
        <CommentHeaderRow>
          <CommentUser>{convertedUser}</CommentUser>
          {diggCount != null && (
            <HeaderStats>
              <Stat icon={ThumbsUp} value={diggCount} label="讚" />
            </HeaderStats>
          )}
        </CommentHeaderRow>
        {postedAt && (
          <CommentDate dateTime={toDateTimeAttr(reply.create_timestamp)}>{postedAt}</CommentDate>
        )}
      </CommentHeader>
      <CommentText>{convertedText}</CommentText>
      {children.length > 0 && (
        <ReplyList>
          {children.map((child, idx) => (
            <ReplyBlock
              key={child.reply_id ?? idx}
              reply={child}
              conversionMode={conversionMode}
            />
          ))}
        </ReplyList>
      )}
    </ReplyItem>
  );
}

function CommentThread({ comment, conversionMode }) {
  const user = comment.user_info?.user_name ?? '匿名';
  const score = comment.score ?? '';
  const text = comment.text ?? '';
  const convertedUser = maybeConvert(user, conversionMode);
  const convertedText = maybeConvert(text, conversionMode);
  const formattedScore = formatScore(score);
  const replyTree = organizeReplies(comment.reply_list);
  const hiddenReplyCount = getHiddenReplyCount(comment);
  const replyCount = comment.reply_count ?? replyTree.length;
  const diggCount = formatDiggCount(comment.digg_count);
  const postedAt = formatTimestamp(comment.create_timestamp);

  return (
    <ThreadItem>
      <CommentHeader>
        <CommentHeaderRow>
          <CommentUser>{convertedUser}</CommentUser>
          {formattedScore != null && (
            <ScoreBadge title={`評分 ${formattedScore}`}>
              <Star aria-hidden />
              {formattedScore}
            </ScoreBadge>
          )}
          {(replyCount > 0 || diggCount != null) && (
            <HeaderStats>
              {replyCount > 0 && (
                <Stat icon={MessageCircle} value={replyCount} label="回覆" />
              )}
              {diggCount != null && (
                <Stat icon={ThumbsUp} value={diggCount} label="讚" />
              )}
            </HeaderStats>
          )}
        </CommentHeaderRow>
        {postedAt && (
          <CommentDate dateTime={toDateTimeAttr(comment.create_timestamp)}>{postedAt}</CommentDate>
        )}
      </CommentHeader>
      <CommentText>{convertedText}</CommentText>

      {replyTree.length > 0 && (
        <ReplyList>
          {replyTree.map((reply, idx) => (
            <ReplyBlock
              key={reply.reply_id ?? idx}
              reply={reply}
              conversionMode={conversionMode}
            />
          ))}
        </ReplyList>
      )}

      {hiddenReplyCount > 0 && (
        <HiddenReplyHint>
          還有 {hiddenReplyCount} 則回覆未顯示
        </HiddenReplyHint>
      )}
    </ThreadItem>
  );
}

export default CommentThread;
