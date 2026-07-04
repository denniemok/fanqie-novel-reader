import React from 'react';
import styled from 'styled-components';
import { Activity, BookImage, Globe, Languages, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalTitleBar, ModalBody } from '../ui/ModalBase';
import SelectDropdown from '../ui/SelectDropdown';
import ApiOverallBadge from './ApiOverallBadge';
import { useApiBase } from '../../hooks/api/useApiBase';
import { useApiStatus } from '../../hooks/api/useApiStatus';
import { useBookDisplayVariant } from '../../contexts/BookDisplayVariantContext';
import { useConversionMode } from '../../hooks/useConversionMode';
import { useTheme } from '../../contexts/ThemeContext';
import {
  API_OPTIONS,
  BOOK_DISPLAY_VARIANT_OPTIONS,
  ZH_CONVERSION_OPTIONS,
} from '../../utils/constants';
import { ROUTES } from '../../utils/navigation';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;

  & + & {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border-color);
  }

  @media (max-height: 500px) {
    gap: 6px;

    & + & {
      margin-top: 12px;
      padding-top: 12px;
    }
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-color-secondary);

  svg {
    color: var(--accent-color);
    flex-shrink: 0;
  }
`;

const SelectField = styled.div`
  width: 100%;

  > div {
    display: flex;
    width: 100%;
  }

  button {
    flex: 1;
    min-width: 0 !important;
    width: 100%;
  }
`;

const ApiOptionRow = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-width: 0;
`;

const ThemeOptionRow = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const StatusLink = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin-top: 4px;
  padding: 10px 12px;
  text-align: left;
  font-size: 13px;
  font-family: inherit;
  color: var(--text-color-secondary);
  background: var(--background-color);
  border: 1px dashed var(--border-color);
  border-radius: var(--border-radius-xs);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;

  svg {
    flex-shrink: 0;
    color: var(--accent-color);
  }

  @media (hover: hover) {
    &:hover {
      background: var(--hover-background-color);
      color: var(--accent-color);
      border-color: var(--accent-color);
    }
  }
`;

const THEME_OPTIONS = [
  { value: 'light', label: '淺色模式', icon: Sun },
  { value: 'dark', label: '深色模式', icon: Moon },
];

function renderThemeOption(opt) {
  const Icon = opt.icon;
  return (
    <ThemeOptionRow>
      <Icon size={16} strokeWidth={2.5} aria-hidden />
      {opt.label}
    </ThemeOptionRow>
  );
}

function SettingsModal({ onClose }) {
  const navigate = useNavigate();
  const [apiBase, handleApiChange] = useApiBase();
  const statusByApi = useApiStatus();
  const { variant, setVariant } = useBookDisplayVariant();
  const [conversionMode, setConversionMode] = useConversionMode();
  const { theme, setTheme } = useTheme();

  const apiOptions = API_OPTIONS.map((opt) => ({
    ...opt,
    status: statusByApi[opt.value],
  }));

  return (
    <Modal onClose={onClose} maxWidth="420px">
      <ModalTitleBar title="設定" onClose={onClose} />
      <ModalBody>
        <Section>
          <SectionHeader>
            <BookImage size={16} strokeWidth={2.5} aria-hidden />
            <span>顯示</span>
          </SectionHeader>
          <SelectField>
            <SelectDropdown
              options={BOOK_DISPLAY_VARIANT_OPTIONS}
              value={variant}
              onChange={setVariant}
              ariaLabel="選擇書名與封面版本"
              menuAlign="left"
              menuPortal
              openUpward="auto"
              triggerMinWidth={0}
            />
          </SelectField>
        </Section>

        <Section>
          <SectionHeader>
            <Globe size={16} strokeWidth={2.5} aria-hidden />
            <span>API 服務</span>
          </SectionHeader>
          <SelectField>
            <SelectDropdown
              options={apiOptions}
              value={apiBase}
              onChange={handleApiChange}
              ariaLabel="選擇 API 服務"
              menuAlign="left"
              menuPortal
              openUpward="auto"
              triggerMinWidth={0}
              renderOption={(opt) => (
                <ApiOptionRow>
                  <span>{opt.label}</span>
                  {opt.status && <ApiOverallBadge status={opt.status} compact />}
                </ApiOptionRow>
              )}
              renderValue={(opt) => (
                <ApiOptionRow>
                  <span>{opt.label}</span>
                  {opt.status && <ApiOverallBadge status={opt.status} compact />}
                </ApiOptionRow>
              )}
            />
          </SelectField>
          <StatusLink
            type="button"
            onClick={() => {
              onClose();
              navigate(ROUTES.status);
            }}
          >
            <Activity size={16} strokeWidth={2.5} aria-hidden />
            API 狀態
          </StatusLink>
        </Section>

        <Section>
          <SectionHeader>
            <Languages size={16} strokeWidth={2.5} aria-hidden />
            <span>繁簡轉換</span>
          </SectionHeader>
          <SelectField>
            <SelectDropdown
              options={ZH_CONVERSION_OPTIONS}
              value={conversionMode}
              onChange={setConversionMode}
              ariaLabel="選擇繁簡轉換"
              menuAlign="left"
              menuPortal
              openUpward="auto"
              triggerMinWidth={0}
            />
          </SelectField>
        </Section>

        <Section>
          <SectionHeader>
            <Moon size={16} strokeWidth={2.5} aria-hidden />
            <span>主題</span>
          </SectionHeader>
          <SelectField>
            <SelectDropdown
              options={THEME_OPTIONS}
              value={theme}
              onChange={setTheme}
              ariaLabel="選擇主題"
              menuAlign="left"
              menuPortal
              openUpward="auto"
              triggerMinWidth={0}
              renderOption={renderThemeOption}
              renderValue={renderThemeOption}
            />
          </SelectField>
        </Section>
      </ModalBody>
    </Modal>
  );
}

export default SettingsModal;
