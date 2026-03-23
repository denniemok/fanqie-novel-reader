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

  a {
    display: inline-block;
    color: var(--accent-color);
    text-decoration: none;
    border: 1px solid var(--accent-color);
    padding: 0px 6px 1px;
    line-height: 1.2;
    vertical-align: baseline;
    background: var(--background-color2);

    &:hover {
      background: var(--accent-color);
      color: #000;
    }
  }
`;

function NoticeBoard() {
  return (
    <Section>
      <SectionTitle><Megaphone /> 公告</SectionTitle>
      <NoticeCard>
        <b>2026-03-23</b> | 批次下載已加入冷卻時間，以較慢速進行，保障所有使用者。<br />
        <b>2026-03-22</b> | 請求將透過負載均衡代理轉發，請節制使用，以免影響其他使用者。<br />
        <b>2026-03-21</b> | 目錄章節排序可切換，進入書籍一律進入目錄，不再直接跳轉最新章節。<br />
        <b>2026-03-13</b> | 已移除無法使用的 API 服務，並標示各服務的可用範圍，改善錯誤訊息顯示。<br />
        <b>2026-03-10</b> | 章節頁頂部新增調色盤按鈕，可切換七種背景，淺色背景自動搭配深色文字以提升閱讀舒適度。<br />
        <b>2026-03-10</b> | 介面全新改版：採用復古極簡風格，明體字型優化閱讀體驗，閱讀區更簡潔專注。<br />
        <b>2026-03-10</b> | 繁簡轉換改為下拉選單，可選擇原文簡體、臺灣繁體、香港繁體，預設為臺灣繁體。<br />
        <b>2026-03-09</b> | 章節快取已升級至 IndexedDB，不再受 localStorage 容量限制，可下載更多章節。
      </NoticeCard>
      <NoticeCard>
        最近第三方 API 服務限流較嚴，服務偶有中斷，敬請見諒。<br />
        站長會持續關注狀況，若有問題歡迎至 <a href="https://github.com/denniemok/fanqie-novel-reader/issues" target="_blank" rel="noopener noreferrer">Issues</a> 回報。<br />
      </NoticeCard>
    </Section>
  );
}

export default NoticeBoard;
