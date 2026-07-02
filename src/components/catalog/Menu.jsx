import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Download, RefreshCw, Minus, Trash2 } from 'lucide-react';
import { useConvertedText } from '../../hooks/useConvertedText';
import { useDownloadManager } from '../../contexts/DownloadManager';
import { isChapterCached, deleteChapter, getCatalogManageMode, setCatalogManageMode } from '../../utils/storage';
import { IconButton } from '../common/IconButton';
import { buildChapterUrl } from '../../utils/navigation';
import { getChapterTitle } from '../../utils/chapter-helpers';
import Status from './Status';
import PageBar from './PageBar';
import { catalogPanelShell } from '../../utils/styled/retro';
import {
  CHAPTERS_PER_PAGE,
  getPaginatedChapters,
  getPageOptions,
  getTotalPages,
} from '../../utils/catalogPagination';

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
  margin: 12px 6px 12px;
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
  border-bottom: 1px dashed var(--border-color);
  padding: 0 16px;
  min-height: 48px;
  transition: all 0.1s steps(2);

  &:hover {
    background-color: var(--catalog-glass-hover);
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
    transition: all 0.1s steps(2);
    font-family: inherit;

    &::before {
      content: '>';
      margin-right: 12px;
      color: var(--accent-color);
      font-weight: 900;
    }

    &:visited {
      color: var(--text-color-secondary);
    }
  }

  &:hover > a {
    color: var(--accent-color);
    transform: translateX(4px);
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
    min-width: 40px;
    min-height: 40px;
  }

  .chapter-actions svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 480px) {
    a {
      font-size: 15px;
    }
  }
`;

function Menu({
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
        <Status isDownloading={downloading} isCached={cached} />
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

export default Menu;
