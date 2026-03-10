import React from 'react';
import styled from 'styled-components';
import { Megaphone } from 'lucide-react';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 900;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--background-color2);
  padding: 7px 12px;
  border: 1px solid var(--border-color);
  width: fit-content;
  box-shadow: 2px 2px 0px var(--background-color);

  svg {
    width: 16px;
    height: 16px;
  }
`;

const NoticeCard = styled.div`
  padding: 20px;
  background-color: var(--background-color2);
  border-radius: 0;
  border: var(--retro-border-width) solid var(--border-color);
  font-size: 14px;
  color: var(--text-color);
  line-height: 1.6;
  box-shadow: var(--retro-shadow);
  font-family: inherit;
  
  b {
    color: var(--accent-color);
    text-decoration: underline;
  }
`;

function NoticeBoard() {
  return (
    <Section>
      <SectionTitle><Megaphone /> 公告</SectionTitle>
      <NoticeCard>
        <b>2026-03-10</b> | 閱讀背景可自訂：章節頁頂部新增調色盤按鈕，可切換深色、灰黑、青綠、米黃、米白、淺灰、純白等七種背景，淺色背景自動搭配深色文字以提升閱讀舒適度。<br />
        <b>2026-03-10</b> | 介面全新改版：採用復古極簡風格，深色 OLED 友善背景、暖琥珀色強調、明體字型優化閱讀體驗，閱讀區更簡潔專注。<br />
        <b>2026-03-10</b> | 繁簡轉換改為下拉選單，可選擇簡體、繁體（台灣）、繁體（香港），預設為台灣繁體。<br />
        <b>2026-03-09</b> | 章節快取已升級至 IndexedDB，不再受 localStorage 容量限制，可下載更多章節。
      </NoticeCard>
    </Section>
  );
}

export default NoticeBoard;
