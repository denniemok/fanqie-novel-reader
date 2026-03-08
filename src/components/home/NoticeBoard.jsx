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
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const NoticeCard = styled.div`
  padding: 20px;
  background-color: var(--background-color2);
  border-radius: 16px;
  border: 1px solid var(--border-color);
  font-size: 14px;
  color: var(--text-color-secondary);
  line-height: 1.6;
`;

function NoticeBoard() {
  return (
    <Section>
      <SectionTitle><Megaphone /> 公告</SectionTitle>
      <NoticeCard>
        2026-03-08 新增 API 來源、字體選擇功能。<br></br>
        For foreign readers, use Google Translate or AI translation plugins in your browser to translate this site.
      </NoticeCard>
    </Section>
  );
}

export default NoticeBoard;
