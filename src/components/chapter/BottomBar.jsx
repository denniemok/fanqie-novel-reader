import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';
import { buildChapterUrl } from '../../utils/navigation';

const BottomBarWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  background-color: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(8px);
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
  border-top: 1px solid var(--border-color);

  a,
  span {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    color: var(--text-color-secondary);
    width: 100%;
    min-height: 44px;
    height: 100%;
    transition: all 0.2s ease;
  }

  a:hover {
    color: var(--text-color);
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const IconWrapper = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ${(p) => (p.$disabled ? 0.2 : 1)};

  svg {
    width: 28px;
    height: 28px;
  }
`;

function BottomBar({ chapterData, bookId }) {
  if (!chapterData || !chapterData.novel_data) return null;

  const { pre_item_id, next_item_id } = chapterData.novel_data;

  return (
    <BottomBarWrapper>
      {pre_item_id ? (
        <Link to={buildChapterUrl(pre_item_id, bookId)} title="上一章">
          <IconWrapper>
            <ChevronLeft size={28} strokeWidth={2} />
          </IconWrapper>
        </Link>
      ) : (
        <span>
          <IconWrapper $disabled>
            <ChevronLeft size={28} strokeWidth={2} />
          </IconWrapper>
        </span>
      )}
      {next_item_id ? (
        <Link to={buildChapterUrl(next_item_id, bookId)} title="下一章">
          <IconWrapper>
            <ChevronRight size={28} strokeWidth={2} />
          </IconWrapper>
        </Link>
      ) : (
        <span>
          <IconWrapper $disabled>
            <ChevronRight size={28} strokeWidth={2} />
          </IconWrapper>
        </span>
      )}
    </BottomBarWrapper>
  );
}

export default BottomBar;
