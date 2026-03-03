import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Minus, Plus, Sun, Moon, RefreshCw, Languages, SlidersHorizontal, X } from 'lucide-react';
import HomeButton from './HomeButton';
import styled from 'styled-components';
import { maybeConvert } from '../utils/zh-convert';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { FONT_SIZE_MIN, FONT_SIZE_MAX, TEXT_BRIGHTNESS_MIN, TEXT_BRIGHTNESS_MAX } from '../utils/constants';

const TopBarWrapper = styled.div`
  display: flex;
  padding: 16px 24px;
  padding-top: calc(16px + env(safe-area-inset-top));
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  background-color: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--border-color);

  @media (max-width: 480px) {
    padding: 12px 16px;
    padding-top: calc(12px + env(safe-area-inset-top));
    gap: 10px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  align-self: stretch;
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const ToolsToggle = styled.button`
  display: none;
  align-items: center;
  justify-content: center;
  padding: 8px;
  min-width: 40px;
  min-height: 40px;
  color: var(--text-color-secondary);
  background: none;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--hover-background-color);
    color: var(--accent-color);
  }

  @media (max-width: 480px) {
    display: flex;
  }
`;

const ToolsPanel = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 480px) {
    position: fixed;
    top: calc(12px + env(safe-area-inset-top));
    right: 0;
    width: min(320px, 90vw);
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 12px;
    background-color: rgba(18, 18, 18, 0.98);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border-color);
    border-right: none;
    border-radius: 12px 0 0 12px;
    z-index: 1001;
    box-shadow: -8px 0 24px rgba(0, 0, 0, 0.4);
    transform: translateX(${(p) => (p.$open ? '0' : '100%')});
    transition: transform 0.25s ease-out;
    overflow: hidden;
  }
`;

const ToolsPanelHeader = styled.div`
  display: none;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 480px) {
    display: flex;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border-color);
  }

  span {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-color);
  }
`;

const ToolsPanelContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 480px) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px;
  }
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  transition: opacity 0.2s ease;

  @media (max-width: 480px) {
    display: block;
  }
`;

const IconLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  min-width: 44px;
  min-height: 44px;
  color: var(--text-color-secondary);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--hover-background-color);
    color: var(--accent-color);
  }

  @media (max-width: 480px) {
    min-width: 40px;
    min-height: 40px;
    padding: 8px;
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  min-width: 44px;
  min-height: 44px;
  color: var(--text-color-secondary);
  background: none;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--hover-background-color);
    color: var(--accent-color);
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    min-width: 40px;
    min-height: 40px;
    padding: 8px;
  }
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;

  h1 {
    color: var(--text-color);
    font-size: 18px;
    font-weight: 600;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 16px;
    }
    h3 {
      font-size: 11px;
    }
  }

  h3 {
    color: var(--text-color-secondary);
    font-size: 12px;
    font-weight: 400;
    margin: 4px 0 0 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ProgressBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  align-self: stretch;
`;

const ProgressBarContainer = styled.div`
  height: 4px;
  flex: 1;
  border-radius: 2px;
  background-color: var(--progressBar);
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background-color: var(--accent-color);
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: var(--text-color-secondary);
  min-width: 60px;
  text-align: right;

  .current {
    color: var(--text-color);
  }
`;

function TopBar({ chapterData, bookInfo, fontSize, onFontSizeChange, textBrightness, onTextBrightnessChange, useTraditionalChinese = false, onTraditionalChineseToggle, onRefresh }) {
  const [toolsExpanded, setToolsExpanded] = useState(false);
  const isMobile = useMediaQuery('(max-width: 480px)');

  if (!chapterData || !chapterData.novel_data) return null;

  const { order, serial_count } = chapterData.novel_data;
  const progress = ((parseInt(order) / parseInt(serial_count)) * 100).toFixed(1);

  const renderTools = () => (
    <>
      <HomeButton />
      {onFontSizeChange && (
        <>
          <IconButton
            type="button"
            title="減小字號"
            disabled={fontSize <= FONT_SIZE_MIN}
            onClick={() => onFontSizeChange(-1)}
          >
            <Minus size={20} strokeWidth={2.5} />
          </IconButton>
          <IconButton
            type="button"
            title="增大字號"
            disabled={fontSize >= FONT_SIZE_MAX}
            onClick={() => onFontSizeChange(1)}
          >
            <Plus size={20} strokeWidth={2.5} />
          </IconButton>
        </>
      )}
      {onTraditionalChineseToggle && (
        <IconButton
          type="button"
          title={useTraditionalChinese ? '切換為簡體中文' : '切換為繁體中文'}
          onClick={onTraditionalChineseToggle}
          style={useTraditionalChinese ? { color: 'var(--accent-color)' } : undefined}
        >
          <Languages size={20} strokeWidth={2.5} />
        </IconButton>
      )}
      {onTextBrightnessChange && (
        <>
          <IconButton
            type="button"
            title="變暗"
            disabled={textBrightness <= TEXT_BRIGHTNESS_MIN}
            onClick={() => onTextBrightnessChange(-1)}
          >
            <Moon size={20} strokeWidth={2.5} />
          </IconButton>
          <IconButton
            type="button"
            title="變亮"
            disabled={textBrightness >= TEXT_BRIGHTNESS_MAX}
            onClick={() => onTextBrightnessChange(1)}
          >
            <Sun size={20} strokeWidth={2.5} />
          </IconButton>
        </>
      )}
      {onRefresh && (
        <IconButton type="button" title="重新載入章節" onClick={onRefresh}>
          <RefreshCw size={20} strokeWidth={2.5} />
        </IconButton>
      )}
      {chapterData.novel_data.book_id && (
        <IconLink to={`/catalog?bookId=${chapterData.novel_data.book_id}`} title="目錄">
          <Menu size={20} strokeWidth={2.5} />
        </IconLink>
      )}
    </>
  );

  return (
    <TopBarWrapper>
      <InfoRow>
        <TitleBlock>
          <h1>{maybeConvert(chapterData.novel_data.title, useTraditionalChinese)}</h1>
          {bookInfo && <h3>{maybeConvert(bookInfo.book_info?.book_name, useTraditionalChinese)}</h3>}
        </TitleBlock>
        <RightActions>
          {isMobile ? (
            <ToolsToggle type="button" title="工具" onClick={() => setToolsExpanded(true)}>
              <SlidersHorizontal size={20} strokeWidth={2.5} />
            </ToolsToggle>
          ) : (
            renderTools()
          )}
        </RightActions>
      </InfoRow>
      {isMobile && (
        <>
          <Overlay $visible={toolsExpanded} onClick={() => setToolsExpanded(false)} aria-hidden="true" />
          <ToolsPanel $open={toolsExpanded}>
            <ToolsPanelHeader>
              <span>工具</span>
              <IconButton type="button" title="關閉" onClick={() => setToolsExpanded(false)}>
                <X size={20} strokeWidth={2.5} />
              </IconButton>
            </ToolsPanelHeader>
            <ToolsPanelContent>{renderTools()}</ToolsPanelContent>
          </ToolsPanel>
        </>
      )}
      <ProgressBox aria-hidden="true">
        <ProgressBarContainer>
          <Progress style={{ width: `${progress}%` }} />
        </ProgressBarContainer>
        <ProgressText>
          <span className="current">{order}</span> / {serial_count}
        </ProgressText>
      </ProgressBox>
    </TopBarWrapper>
  );
}

export default TopBar;
