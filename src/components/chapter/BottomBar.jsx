import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import styled, { css } from 'styled-components';
import { buildChapterUrl } from '../../utils/navigation';
import { chapterBottomBar } from '../../utils/styled/viewport';

const BottomBarWrapper = styled.nav`
  flex-shrink: 0;
  ${chapterBottomBar(56)}
  display: flex;
  align-items: stretch;
  background-color: var(--topbar-bg);
  backdrop-filter: saturate(1.4) blur(20px);
  -webkit-backdrop-filter: saturate(1.4) blur(20px);
  z-index: 1000;
  border-top: 1px solid var(--border-color);
`;

const navItem = css`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  text-decoration: none;
  font-size: 14px;
  letter-spacing: 0.12em;
  color: var(--text-color-secondary);
  transition: var(--transition-default);

  &:not(:first-child) {
    border-left: 1px solid var(--border-color);
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const NavLink = styled(Link)`
  ${navItem}

  @media (hover: hover) {
    &:hover {
      color: var(--accent-color);
      background-color: var(--hover-background-color);
    }
  }
`;

const NavDisabled = styled.span`
  ${navItem}
  opacity: 0.3;
`;

function ChapterNav({ itemId, bookId, label, direction }) {
  const icon = direction === 'prev' ? <ChevronLeft aria-hidden /> : <ChevronRight aria-hidden />;
  const content = direction === 'prev' ? <>{icon}{label}</> : <>{label}{icon}</>;
  return itemId ? (
    <NavLink to={buildChapterUrl(itemId, bookId)} title={label}>{content}</NavLink>
  ) : (
    <NavDisabled aria-disabled="true">{content}</NavDisabled>
  );
}

function BottomBar({ chapterData, bookId }) {
  if (!chapterData) return null;

  const { pre_item_id, next_item_id } = chapterData.novel_data ?? {};

  return (
    <BottomBarWrapper aria-label="章節導覽">
      <ChapterNav itemId={pre_item_id} bookId={bookId} label="上一章" direction="prev" />
      <ChapterNav itemId={next_item_id} bookId={bookId} label="下一章" direction="next" />
    </BottomBarWrapper>
  );
}

export default BottomBar;
