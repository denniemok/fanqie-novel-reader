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
        <b>2026-04-06</b> | 新增多組快速服務供選擇。<br />
        <b>2026-03-25</b> | 目錄與詳情改為並行載入，部分載入失敗會顯示簡短提示。<br />
        <b>2026-03-23</b> | 批次下載已加入冷卻時間，以較慢速進行，保障所有使用者。<br />
        <b>2026-03-22</b> | 請求將透過負載均衡代理轉發，請節制使用，以免影響其他使用者。<br />
      </NoticeCard>
      <NoticeCard>
        若有問題歡迎至 <a href="https://github.com/denniemok/fanqie-novel-reader/issues" target="_blank" rel="noopener noreferrer">Issues</a> 回報。<br />
      </NoticeCard>
    </Section>
  );
}

export default NoticeBoard;
