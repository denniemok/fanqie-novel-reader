import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { maybeConvert } from '../utils/zh-convert';

const MenuList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const MenuItem = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
  padding: 0 16px;
  min-height: 48px;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--hover-background-color);
  }

  a {
    display: block;
    padding: 16px 0;
    text-decoration: none;
    color: var(--text-color);
    font-size: 16px;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.2s ease;

    &::before {
      content: '•';
      margin-right: 12px;
      color: var(--accent-color);
      font-size: 20px;
      vertical-align: middle;
      line-height: 0;
    }

    &:visited {
      color: var(--text-color-secondary);
    }
  }

  &:hover > a {
    color: var(--accent-color);
  }

  span {
    font-size: 12px;
    color: var(--text-color-secondary);
    margin-left: 16px;
    opacity: 0.7;
    flex-shrink: 0;
    white-space: nowrap;
  }

  @media (max-width: 480px) {
    a {
      font-size: 15px;
    }
    span {
      display: none;
    }
  }
`;

function Menu({ itemDataList, sortOrder, bookId, useTraditionalChinese = false }) {
  const items = [...(itemDataList || [])];

  const compareChapters = (a, b) => {
    const regex = /第(\d+)章/;
    const aMatch = a.title.match(regex);
    const bMatch = b.title.match(regex);
    if (!aMatch || !bMatch) return 0;
    const aChapter = parseInt(aMatch[1]);
    const bChapter = parseInt(bMatch[1]);
    if (sortOrder === 'descending') return bChapter - aChapter;
    return aChapter - bChapter;
  };

  items.sort(compareChapters);

  return (
    <MenuList>
      {items.map((item) => (
        <MenuItem key={item.item_id}>
          <Link to={`/chapter?itemId=${item.item_id}${bookId ? `&bookId=${bookId}` : ''}`}>{maybeConvert(item.title, useTraditionalChinese)}</Link>
          {item.chapter_word_number != null && <span>共計{item.chapter_word_number}字</span>}
        </MenuItem>
      ))}
    </MenuList>
  );
}

export default Menu;
