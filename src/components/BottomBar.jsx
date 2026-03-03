import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';

const BottomBarWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  background-color: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
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
    color: var(--accent-color);
    background-color: var(--hover-background-color);
  }
`;

const IconWrapper = styled.span`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: ${(p) => (p.$disabled ? 0.15 : 1)};

  svg {
    width: 28px;
    height: 28px;
  }
`;

function BottomBar({ chapterData, bookId }) {
  if (!chapterData || !chapterData.novel_data) return null;

  const { pre_item_id, next_item_id } = chapterData.novel_data;
  const query = (id) => (bookId ? `itemId=${id}&bookId=${bookId}` : `itemId=${id}`);

  return (
    <BottomBarWrapper aria-hidden="true">
      {pre_item_id ? (
        <Link to={`/chapter?${query(pre_item_id)}`} title="上一章">
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
        <Link to={`/chapter?${query(next_item_id)}`} title="下一章">
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
