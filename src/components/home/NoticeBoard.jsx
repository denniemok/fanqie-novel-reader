import React from 'react';
import styled from 'styled-components';
import { Megaphone } from 'lucide-react';

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
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
        <b>2026-04-06</b> | 新增多組 API 服務；閱讀歷史改為手動排序；無歷史時顯示範例書。<br />
      </NoticeCard>
      <NoticeCard>
        <b>2026-06-14</b> | 首頁新增書架、新書、公告與回報入口；書架支援排序、格狀視圖與收藏夾管理。<br />
      </NoticeCard>
    </Section>
  );
}

export default NoticeBoard;
