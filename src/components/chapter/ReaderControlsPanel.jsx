import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Minus, Plus, Sun, Moon, Type, Palette, RefreshCw } from 'lucide-react';
import { ModalOverlay } from '../common/ModalBase';
import { IconButton } from '../common/IconButton';
import IconDropdown from '../common/IconDropdown';
import CatalogButton from '../common/CatalogButton';
import {
  FONT_SIZE_MIN,
  FONT_SIZE_MAX,
  TEXT_BRIGHTNESS_MIN,
  TEXT_BRIGHTNESS_MAX,
  CHINESE_FONTS,
  READER_BACKGROUND_OPTIONS,
} from '../../utils/constants';
import { catalogPanelShell } from '../../utils/styled/retro';
import { thinScrollbarStyles } from '../../utils/styled/scrollbars';

const Overlay = styled(ModalOverlay)`
  display: block;
  padding: 0;
  z-index: 950;
  background: transparent;
`;

const Panel = styled.aside`
  position: fixed;
  right: max(12px, env(safe-area-inset-right));
  top: calc(128px + env(safe-area-inset-top));
  bottom: calc(64px + env(safe-area-inset-bottom));
  z-index: 960;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: safe center;
  gap: 8px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  padding: 4px 0;
  ${thinScrollbarStyles}

  @media (max-width: 480px) {
    right: max(8px, env(safe-area-inset-right));
    top: calc(118px + env(safe-area-inset-top));
    gap: 6px;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 8px;
  flex-shrink: 0;
  ${catalogPanelShell}

  @media (max-width: 480px) {
    gap: 6px;
    padding: 8px 6px;
  }
`;

function ReaderControlsPanel({
  open,
  onClose,
  bookId,
  onRefresh,
  fontSize,
  onFontSizeChange,
  fontFamily,
  onFontFamilyChange,
  textBrightness,
  onTextBrightnessChange,
  readerBackground,
  onReaderBackgroundChange,
}) {
  const hasActions = onRefresh || bookId;

  if (!open) return null;

  return createPortal(
    <>
      <Overlay onClick={onClose} aria-hidden="false" />
      <Panel $open role="dialog" aria-modal="true" aria-label="閱讀設定">
        <Section>
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
              menuPlacement="left"
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
              menuPlacement="left"
            />
          )}
        </Section>
        {hasActions && (
          <Section>
            {onRefresh && (
              <IconButton type="button" title="刷新章節" onClick={onRefresh}>
                <RefreshCw size={20} strokeWidth={2.5} />
              </IconButton>
            )}
            {bookId && <CatalogButton bookId={bookId} />}
          </Section>
        )}
      </Panel>
    </>,
    document.body,
  );
}

export default ReaderControlsPanel;
