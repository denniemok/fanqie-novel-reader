import React from 'react';
import styled from 'styled-components';
import { Minus, Plus, Sun, Moon, RefreshCw, Type, Palette } from 'lucide-react';
import { useConvertedText } from '../../hooks/useConvertedText';
import ActionBar from '../common/ActionBar';
import HomeButton from '../common/HomeButton';
import BookshelfButton from '../common/BookshelfButton';
import CatalogButton from '../common/CatalogButton';
import ThemeToggle from '../common/ThemeToggle';
import ApiDropdown from '../common/ApiDropdown';
import LangDropdown from '../common/LangDropdown';
import BookVariantDropdown from '../common/BookVariantDropdown';
import { IconButton } from '../common/IconButton';
import IconDropdown from '../common/IconDropdown';
import { FONT_SIZE_MIN, FONT_SIZE_MAX, TEXT_BRIGHTNESS_MIN, TEXT_BRIGHTNESS_MAX, CHINESE_FONTS, READER_BACKGROUND_OPTIONS } from '../../utils/constants';
import { resolveBookDisplay } from '../../utils/bookInfo';
import { useBookDisplayVariant } from '../../contexts/BookDisplayVariantContext';

const TopBarWrapper = styled.div`
  display: flex;
  padding: 16px 24px;
  padding-top: calc(16px + env(safe-area-inset-top));
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  background-color: var(--topbar-bg);
  backdrop-filter: blur(12px);
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

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;

  h1 {
    color: var(--text-color);
    font-size: 16px;
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
  border-radius: 999px;
  background-color: var(--accent-soft);
  overflow: hidden;
`;

const Progress = styled.div`
  height: 100%;
  background-color: var(--accent-color);
  transition: width 0.1s steps(10);
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

function TopBar({ chapterData, bookInfo, bookId, itemId, fontSize, onFontSizeChange, fontFamily, onFontFamilyChange, textBrightness, onTextBrightnessChange, readerBackground, onReaderBackgroundChange, conversionMode = 'tw', onConversionModeChange, onRefresh }) {
  const { variant, setVariant } = useBookDisplayVariant();
  const novelData = chapterData?.novel_data;
  const convertedTitle = useConvertedText(novelData?.title, conversionMode);
  const { book_name: displayBookName } = resolveBookDisplay(bookInfo, variant, bookId);
  const convertedBookName = useConvertedText(displayBookName, conversionMode);

  if (!chapterData) return null;

  const catalogBookId = bookId ?? novelData?.book_id;
  const displayTitle = convertedTitle || (itemId ? `第 ${itemId} 章` : '章節');
  const { order, serial_count } = novelData ?? {};
  const progress = order && serial_count
    ? ((parseInt(order, 10) / parseInt(serial_count, 10)) * 100).toFixed(1)
    : null;

  return (
    <TopBarWrapper>
      <InfoRow>
        <TitleBlock>
          <h1>{displayTitle}</h1>
          {bookInfo && <h3>{convertedBookName}</h3>}
        </TitleBlock>
        <ActionBar>
            <HomeButton />
            <BookshelfButton />
            {onFontSizeChange && (
              <IconButton
                type="button"
                title="減小字號"
                disabled={fontSize <= FONT_SIZE_MIN}
                onClick={() => onFontSizeChange(-1)}
              >
                <Minus size={20} strokeWidth={2.5} />
              </IconButton>
            )}
            {onFontSizeChange && (
              <IconButton
                type="button"
                title="增大字號"
                disabled={fontSize >= FONT_SIZE_MAX}
                onClick={() => onFontSizeChange(1)}
              >
                <Plus size={20} strokeWidth={2.5} />
              </IconButton>
            )}
            {onFontFamilyChange && (
              <IconDropdown
                icon={<Type size={20} strokeWidth={2.5} />}
                title="字體"
                ariaLabel="選擇字體"
                options={CHINESE_FONTS}
                value={fontFamily}
                onChange={onFontFamilyChange}
              />
            )}
            {onTextBrightnessChange && (
              <IconButton
                type="button"
                title="變暗"
                disabled={textBrightness <= TEXT_BRIGHTNESS_MIN}
                onClick={() => onTextBrightnessChange(-1)}
              >
                <Moon size={20} strokeWidth={2.5} />
              </IconButton>
            )}
            {onTextBrightnessChange && (
              <IconButton
                type="button"
                title="變亮"
                disabled={textBrightness >= TEXT_BRIGHTNESS_MAX}
                onClick={() => onTextBrightnessChange(1)}
              >
                <Sun size={20} strokeWidth={2.5} />
              </IconButton>
            )}
            {onReaderBackgroundChange && (
              <IconDropdown
                icon={<Palette size={20} strokeWidth={2.5} />}
                title="閱讀背景"
                ariaLabel="選擇閱讀背景顏色"
                options={READER_BACKGROUND_OPTIONS}
                value={readerBackground}
                onChange={onReaderBackgroundChange}
              />
            )}
            <ApiDropdown />
            <BookVariantDropdown value={variant} onChange={setVariant} />
            {onConversionModeChange && (
              <LangDropdown
                value={conversionMode}
                onChange={onConversionModeChange}
              />
            )}
            {onRefresh && (
              <IconButton type="button" title="刷新章節" onClick={onRefresh}>
                <RefreshCw size={20} strokeWidth={2.5} />
              </IconButton>
            )}
            <CatalogButton bookId={catalogBookId} />
            <ThemeToggle />
          </ActionBar>
      </InfoRow>
      {progress != null && (
      <ProgressBox aria-hidden="true">
        <ProgressBarContainer>
          <Progress style={{ width: `${progress}%` }} />
        </ProgressBarContainer>
        <ProgressText>
          <span className="current">{order}</span> / {serial_count}
        </ProgressText>
      </ProgressBox>
      )}
    </TopBarWrapper>
  );
}

export default TopBar;
