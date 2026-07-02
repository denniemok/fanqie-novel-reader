import { MessageCircle, Star, ThumbsUp } from 'lucide-react';
import styled from 'styled-components';
import { maybeConvert } from '../../utils/text/zh-convert';
import { getHiddenReplyCount, organizeReplies } from '../../utils/commentReplies';

const ThreadItem = styled.li`
  padding: 16px;
  background: var(--card-surface);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--retro-shadow);
  color: var(--text-color);
  transition: all 0.1s steps(2);

  &:hover {
    background-color: var(--hover-background-color);
    border-color: color-mix(in srgb, var(--accent-color) 40%, var(--border-color));
  }
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
`;

const CommentUser = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: var(--accent-color);
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
  font-size: 11px;
  font-weight: 700;
  color: var(--text-on-accent);
  padding: 3px 8px;
  background: rgba(201, 128, 154, 0.85);
  border: 1px solid rgba(255, 248, 245, 0.4);
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
  font-weight: 600;
  color: var(--text-color-secondary);
  white-space: nowrap;

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    opacity: 0.85;
  }
`;

const CommentText = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: var(--text-color);
  white-space: pre-wrap;
  word-break: break-word;
`;

const ReplyList = styled.ul`
  list-style: none;
  margin: 14px 0 0;
  padding: 0 0 0 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-left: 2px solid color-mix(in srgb, var(--accent-color) 30%, var(--border-color));
`;

const ReplyItem = styled.li`
  padding: 12px;
  background: var(--background-color2);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  transition: background-color 0.1s steps(2);

  &:hover {
    background-color: var(--hover-background-color);
  }
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
  const children = reply.children ?? [];

  return (
    <ReplyItem>
      <CommentHeader>
        <CommentUser>{convertedUser}</CommentUser>
        {diggCount != null && (
          <HeaderStats>
            <Stat icon={ThumbsUp} value={diggCount} label="讚" />
          </HeaderStats>
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

  return (
    <ThreadItem>
      <CommentHeader>
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
