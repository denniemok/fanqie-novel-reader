import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Download, RefreshCw, Minus, Trash2 } from 'lucide-react';
import { useConvertedText } from '../../hooks/useConvertedText';
import { useDownloadManager } from '../../contexts/DownloadManager';
import { isChapterCached, deleteChapter, getCatalogManageMode, setCatalogManageMode } from '../../utils/storage';
import { IconButton } from '../ui/IconButton';
import { buildChapterUrl } from '../../utils/navigation';
import { getChapterTitle } from '../../utils/chapter-helpers';
import ChapterCacheStatus from './ChapterCacheStatus';
import PageBar from './PageBar';
import { catalogPanelShell } from '../../utils/styled/retro';
import {
  CHAPTERS_PER_PAGE,
  getPaginatedChapters,
  getPageOptions,
  getTotalPages,
} from '../../utils/book/catalogPagination';

const DisabledLinkSpan = styled.span`
  display: block;
  padding: 16px 0;
  flex: 1;
  color: var(--text-color-secondary);
  cursor: not-allowed;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CatalogPanel = styled.section`
  ${catalogPanelShell}
`;

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
  padding: 0 20px;
  min-height: 52px;
  position: relative;
  transition: background-color 0.2s ease;

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 20px;
    right: 20px;
    bottom: 0;
    height: 1px;
    background: var(--border-color);
  }

  &:hover {
    background-color: var(--catalog-glass-hover);
  }

  a {
    display: block;
    padding: 15px 0;
    text-decoration: none;
    color: var(--text-color);
    font-family: var(--display-font-family);
    font-size: 16px;
    letter-spacing: 0.03em;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.2s ease;

    &:visited {
      color: var(--text-color-secondary);
    }
  }

  &:hover > a {
    color: var(--accent-color);
  }

  .chapter-actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    margin-left: 8px;
  }

  .chapter-actions button {
    padding: 8px;
    min-width: 36px;
    min-height: 36px;
    background: transparent;
    border-color: transparent;
    color: var(--text-color-secondary);
  }

  .chapter-actions svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 480px) {
    padding: 0 16px;

    &:not(:last-child)::after {
      left: 16px;
      right: 16px;
    }

    a {
      font-size: 15px;
    }
  }
`;

function CatalogChapterList({
  itemDataList,
  sortOrder,
  bookId,
  conversionMode = 'tw',
  onChapterDeleted,
  currentPage = 0,
  chaptersPerPage = CHAPTERS_PER_PAGE,
  onPagePrev,
  onPageNext,
  onPageSelect,
  onSortChange,
}) {
  const { isDownloading } = useDownloadManager();
  const [manageMode, setManageMode] = useState(getCatalogManageMode);
  const totalChapters = itemDataList?.length ?? 0;
  const totalPages = getTotalPages(totalChapters, chaptersPerPage);
  const paginatedItems = getPaginatedChapters(itemDataList, sortOrder, currentPage, chaptersPerPage);
  const pageOptions = getPageOptions(totalChapters, sortOrder, chaptersPerPage);
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  const pageBarProps = {
    currentPage,
    pageOptions,
    canGoPrev,
    canGoNext,
    onPagePrev,
    onPageNext,
    onPageSelect,
    sortOrder,
    onSortChange,
    manageMode,
    onManageModeToggle: () => {
      setManageMode((on) => {
        const next = !on;
        setCatalogManageMode(next);
        return next;
      });
    },
  };

  return (
    <CatalogPanel>
      <PageBar {...pageBarProps} />
      <MenuList>
        {paginatedItems.map((item) => (
          <MenuItem key={item.item_id}>
            <MenuItemLink item={item} bookId={bookId} conversionMode={conversionMode} isDownloading={isDownloading(item.item_id)} />
            <ChapterActions item={item} manageMode={manageMode} onChapterDeleted={onChapterDeleted} />
          </MenuItem>
        ))}
      </MenuList>
      <PageBar {...pageBarProps} menuOpensUp />
    </CatalogPanel>
  );
}

function MenuItemLink({ item, bookId, conversionMode, isDownloading }) {
  const convertedTitle = useConvertedText(getChapterTitle(item), conversionMode);

  if (isDownloading) {
    return (
      <DisabledLinkSpan>
        {convertedTitle}
      </DisabledLinkSpan>
    );
  }

  return <Link to={buildChapterUrl(item.item_id, bookId)}>{convertedTitle}</Link>;
}

function ChapterActions({ item, manageMode, onChapterDeleted }) {
  const { addToQueue, isDownloading, completedDownloads } = useDownloadManager();
  const itemId = item.item_id;
  const [deleted, setDeleted] = useState(false);
  const [actualCached, setActualCached] = useState(false);
  const downloading = isDownloading(itemId);
  const cached = actualCached && !deleted;

  useEffect(() => {
    isChapterCached(itemId).then(setActualCached);
  }, [itemId, completedDownloads]);

  useEffect(() => {
    if (actualCached && deleted) {
      setDeleted(false);
    }
  }, [actualCached, deleted]);

  const getActionIcon = () => {
    if (downloading) return <Minus size={18} style={{ opacity: 0.5 }} />;
    if (cached) return <RefreshCw size={18} />;
    return <Download size={18} />;
  };

  const getActionTitle = () => {
    if (downloading) return '下載中';
    if (cached) return '刷新章節';
    return '下載';
  };

  const getStatusTitle = () => {
    if (downloading) return '下載中';
    if (cached) return '已下載';
    return '未下載';
  };

  const handleClick = () => {
    if (downloading) return;
    addToQueue(itemId, cached);
  };

  const handleDelete = async () => {
    if (downloading) return;
    await deleteChapter(itemId);
    setActualCached(false);
    setDeleted(true);
    onChapterDeleted?.(itemId);
  };

  return (
    <div className="chapter-actions">
      <span title={getStatusTitle()} style={{ display: 'flex', color: 'var(--text-color-secondary)' }}>
        <ChapterCacheStatus isDownloading={downloading} isCached={cached} />
      </span>
      {manageMode && (
        <>
          <IconButton
            type="button"
            title={getActionTitle()}
            onClick={handleClick}
            disabled={downloading}
          >
            {getActionIcon()}
          </IconButton>
          {cached && (
            <IconButton type="button" title="刪除章節" onClick={handleDelete}>
              <Trash2 size={18} />
            </IconButton>
          )}
        </>
      )}
    </div>
  );
}

export default CatalogChapterList;
