import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const NoticeCard = styled.div`
  padding: 18px 20px;
  background: var(--card-surface);
  border-radius: var(--border-radius-sm);
  border: var(--retro-border-width) dashed var(--border-color);
  font-size: 14px;
  color: var(--text-color);
  line-height: 1.65;
  box-shadow: var(--retro-shadow);
  font-family: inherit;
  transition: var(--transition-default);

  @media (hover: hover) {
    &:hover {
      border-color: color-mix(in srgb, var(--accent-color) 40%, var(--border-color));
      transform: translateX(2px);
    }
  }

  b {
    display: inline-block;
    color: var(--accent-color);
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.04em;
    text-decoration: none;
    background: var(--accent-soft);
    padding: 2px 8px;
    border-radius: var(--border-radius-xs);
    margin-right: 4px;
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
      color: var(--text-on-accent);
    }
  }
`;

const ANNOUNCEMENTS = [
  {
    date: '2026-06-14',
    message: '首頁新增書架、新書、公告與回報入口；書架支援排序、格狀視圖與收藏夾管理。',
  },
  {
    date: '2026-04-06',
    message: '新增多組 API 服務；閱讀歷史改為手動排序；無歷史時顯示範例書。',
  },
  {
    date: '2026-03-25',
    message: '目錄與詳情改為並行載入，部分載入失敗會顯示簡短提示。',
  },
  {
    date: '2026-03-25',
    message: '已修正最新第三方 API 服務不可用問題。',
  },
  {
    date: '2026-03-23',
    message: '批次下載已加入冷卻時間，以較慢速進行，保障所有使用者。',
  },
  {
    date: '2026-03-22',
    message: '請求將透過負載均衡代理轉發，請節制使用，以免影響其他使用者。',
  },
  {
    date: '2026-03-21',
    message: '目錄章節排序可切換，進入書籍一律進入目錄，不再直接跳轉最新章節。',
  },
  {
    date: '2026-03-13',
    message: '已移除無法使用的 API 服務，並標示各服務的可用範圍，改善錯誤訊息顯示。',
  },
  {
    date: '2026-03-10',
    message: '章節頁頂部新增調色盤按鈕，可切換七種背景，淺色背景自動搭配深色文字以提升閱讀舒適度。',
  },
  {
    date: '2026-03-10',
    message: '介面全新改版：採用復古極簡風格，明體字型優化閱讀體驗，閱讀區更簡潔專注。',
  },
  {
    date: '2026-03-10',
    message: '繁簡轉換改為下拉選單，可選擇原文簡體、臺灣繁體、香港繁體，預設為臺灣繁體。',
  },
  {
    date: '2026-03-09',
    message: '章節快取已升級至 IndexedDB，不再受 localStorage 容量限制，可下載更多章節。',
  },
];

function NoticeBoard() {
  return (
    <Section>
      {ANNOUNCEMENTS.map((item) => (
        <NoticeCard key={`${item.date}-${item.message}`}>
          <b>{item.date}</b> {item.message}
        </NoticeCard>
      ))}
    </Section>
  );
}

export default NoticeBoard;
