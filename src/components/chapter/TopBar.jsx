import React from 'react';
import styled from 'styled-components';
import { Minus, Plus, Sun, Moon, RefreshCw, Type, Palette } from 'lucide-react';
import { useConvertedText } from '../../hooks/useConvertedText';
import ActionBar from '../common/ActionBar';
import HomeButton, { HOME_BUTTON_TITLE } from '../common/HomeButton';
import CatalogButton, { CATALOG_BUTTON_TITLE } from '../common/CatalogButton';
import ApiDropdown, { API_DROPDOWN_TITLE } from '../common/ApiDropdown';
import LangDropdown, { LANG_DROPDOWN_TITLE } from '../common/LangDropdown';
import { IconButton } from '../common/IconButton';
import IconDropdown from '../common/IconDropdown';
import { FONT_SIZE_MIN, FONT_SIZE_MAX, TEXT_BRIGHTNESS_MIN, TEXT_BRIGHTNESS_MAX, CHINESE_FONTS, READER_BACKGROUND_OPTIONS } from '../../utils/constants';

const TopBarWrapper = styled.div`
  display: flex;
  padding: 16px 24px;
  padding-top: calc(16px + env(safe-area-inset-top));
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  background-color: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(8px);
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
  height: 3px;
  flex: 1;
  border-radius: 0;
  background-color: rgba(255, 255, 255, 0.05);
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

function TopBar({ chapterData, bookInfo, fontSize, onFontSizeChange, fontFamily, onFontFamilyChange, textBrightness, onTextBrightnessChange, readerBackground, onReaderBackgroundChange, conversionMode = 'tw', onConversionModeChange, onRefresh }) {
  const convertedTitle = useConvertedText(chapterData?.novel_data?.title, conversionMode);
  const convertedBookName = useConvertedText(bookInfo?.book_info?.original_book_name, conversionMode);

  if (!chapterData || !chapterData.novel_data) return null;

  const { order, serial_count } = chapterData.novel_data;
  const progress = ((parseInt(order) / parseInt(serial_count)) * 100).toFixed(1);

  return (
    <TopBarWrapper>
      <InfoRow>
        <TitleBlock>
          <h1>{convertedTitle}</h1>
          {bookInfo && <h3>{convertedBookName}</h3>}
        </TitleBlock>
        <ActionBar>
            <HomeButton title={HOME_BUTTON_TITLE} />
            <ApiDropdown title={API_DROPDOWN_TITLE} />
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
            {onConversionModeChange && (
              <LangDropdown
                title={LANG_DROPDOWN_TITLE}
                value={conversionMode}
                onChange={onConversionModeChange}
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
            {onRefresh && (
              <IconButton type="button" title="刷新章節" onClick={onRefresh}>
                <RefreshCw size={20} strokeWidth={2.5} />
              </IconButton>
            )}
            <CatalogButton
              title={CATALOG_BUTTON_TITLE}
              bookId={chapterData?.novel_data?.book_id}
            />
          </ActionBar>
      </InfoRow>
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
