import React, { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { IconButton } from './IconButton';
import styled from 'styled-components';
import { useConvertedText } from '../hooks/useConvertedText';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { RightActions } from './common/ActionBar';
import TopBarTools from './TopBarTools';

const TopBarWrapper = styled.div`
  display: flex;
  padding: 16px 24px;
  padding-top: calc(16px + env(safe-area-inset-top));
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  background-color: rgba(18, 18, 18, 0.95);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
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
    width: min(240px, 85vw);
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  flex-shrink: 0;
  padding-bottom: 16px;

  @media (max-width: 480px) {
    gap: 2px;
    padding-bottom: 20px;
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
  const convertedTitle = useConvertedText(chapterData?.novel_data?.title, useTraditionalChinese);
  const convertedBookName = useConvertedText(bookInfo?.book_info?.book_name, useTraditionalChinese);

  if (!chapterData || !chapterData.novel_data) return null;

  const { order, serial_count } = chapterData.novel_data;
  const progress = ((parseInt(order) / parseInt(serial_count)) * 100).toFixed(1);

  const toolsProps = {
    chapterData,
    fontSize,
    onFontSizeChange,
    textBrightness,
    onTextBrightnessChange,
    useTraditionalChinese,
    onTraditionalChineseToggle,
    onRefresh,
  };

  return (
    <TopBarWrapper>
      <InfoRow>
        <TitleBlock>
          <h1>{convertedTitle}</h1>
          {bookInfo && <h3>{convertedBookName}</h3>}
        </TitleBlock>
        <RightActions>
          {isMobile ? (
            <ToolsToggle type="button" title="工具" onClick={() => setToolsExpanded(true)}>
              <SlidersHorizontal size={20} strokeWidth={2.5} />
            </ToolsToggle>
          ) : (
            <TopBarTools {...toolsProps} />
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
            <ToolsPanelContent>
              <TopBarTools {...toolsProps} />
            </ToolsPanelContent>
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
