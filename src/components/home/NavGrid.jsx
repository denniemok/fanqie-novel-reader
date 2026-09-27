import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { Archive, ArrowUpRight, BookOpen, Compass, Download, FileText, Github, Megaphone, MessageCircleWarning, Activity } from 'lucide-react';
import { GITHUB_ISSUES_URL, GITHUB_REPO_URL } from '../../utils/constants';
import { ROUTES, buildDefaultDiscoverUrl } from '../../utils/navigation';
import { SectionTitle } from '../../utils/styled/sections';

const Section = styled.section`
  width: 100%;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: homeCardEntrance 0.6s var(--ease-out) ${(p) => p.$delay ?? 0}s both;

  @media (max-width: 480px) { margin-top: 32px; gap: 14px; }
`;

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 480px) { gap: 8px; }
`;

const surface = css`
  border: 1px solid var(--border-color);
  background: var(--surface-muted);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
`;

const QuickButton = styled.button`
  ${surface}
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  border-radius: var(--border-radius);
  color: var(--text-color);
  text-align: left;
  font-family: var(--ui-font-family);
  cursor: pointer;
  transition: var(--transition-default);

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--accent-soft);
    color: var(--accent-color);
    transition: var(--transition-default);
  }
  svg { width: 18px; height: 18px; }
  .text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  strong { font-family: var(--display-font-family); font-size: 17px; font-weight: 600; letter-spacing: 0.1em; line-height: 1.4; white-space: nowrap; }
  span.desc { color: var(--text-color-secondary); font-size: 12px; letter-spacing: 0.04em; line-height: 1.5; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  @media (hover: hover) {
    &:hover { background: var(--surface-raised); border-color: var(--border-strong); }
    &:hover .icon { background: var(--accent-color); color: var(--text-on-accent); }
  }
  &:active { transform: scale(0.985); }

  @media (max-width: 480px) {
    gap: 10px;
    padding: 14px 12px;
    .icon { width: 32px; height: 32px; }
    svg { width: 16px; height: 16px; }
    strong { font-size: 15px; letter-spacing: 0.06em; }
    span.desc { display: none; }
  }
`;

const UtilityPanel = styled.div`
  ${surface}
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-radius: var(--border-radius);
  overflow: hidden;

  /* Hairline grid: each cell draws its right/bottom edge; the panel border covers the outer edge. */
  && > * { border-right: 1px solid var(--border-color); border-bottom: 1px solid var(--border-color); }
  && > *:nth-child(3n) { border-right: none; }
  && > *:nth-last-child(-n + 3) { border-bottom: none; }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    && > *:nth-child(3n) { border-right: 1px solid var(--border-color); }
    && > *:nth-child(2n) { border-right: none; }
    && > *:nth-last-child(3) { border-bottom: 1px solid var(--border-color); }
  }
`;

const utilityItem = css`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 15px 18px;
  border: 0;
  background: transparent;
  color: var(--text-color);
  font-family: var(--ui-font-family);
  font-size: 14px;
  letter-spacing: 0.06em;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition-default);

  svg { width: 17px; height: 17px; flex-shrink: 0; color: var(--text-color-secondary); transition: color 0.2s ease; }
  svg.external { width: 14px; height: 14px; margin-left: auto; opacity: 0.6; }

  @media (hover: hover) {
    &:hover { background: var(--hover-background-color); color: var(--accent-color); }
    &:hover svg { color: var(--accent-color); }
  }

  @media (max-width: 480px) { padding: 14px 16px; font-size: 13px; gap: 10px; }
`;

const UtilityButton = styled.button`${utilityItem}`;
const UtilityLink = styled.a`${utilityItem}`;

const QUICK_ITEMS = [
  { key: 'bookshelf', Icon: BookOpen, title: '書架', desc: '閱讀歷史與收藏', to: () => ROUTES.bookshelf },
  { key: 'discover', Icon: Compass, title: '找書', desc: '開始一段新閱讀', to: buildDefaultDiscoverUrl },
  { key: 'download', Icon: Download, title: '下載', desc: '離線閱讀與管理', to: () => ROUTES.download },
];

function NavGrid() {
  const navigate = useNavigate();
  return (
    <>
      <Section $delay={0.18}>
        <SectionTitle>常用功能</SectionTitle>
        <QuickGrid>
          {QUICK_ITEMS.map(({ key, Icon, title, desc, to }) => (
            <QuickButton key={key} type="button" onClick={() => navigate(to())}>
              <span className="icon"><Icon aria-hidden /></span>
              <span className="text">
                <strong>{title}</strong>
                <span className="desc">{desc}</span>
              </span>
            </QuickButton>
          ))}
        </QuickGrid>
      </Section>
      <Section $delay={0.26}>
        <SectionTitle>工具與資訊</SectionTitle>
        <UtilityPanel>
          <UtilityButton type="button" onClick={() => navigate(ROUTES.announcements)}><Megaphone aria-hidden />公告</UtilityButton>
          <UtilityButton type="button" onClick={() => navigate(ROUTES.status)}><Activity aria-hidden />API 狀態</UtilityButton>
          <UtilityButton type="button" onClick={() => navigate(ROUTES.export)}><Archive aria-hidden />備份</UtilityButton>
          <UtilityButton type="button" onClick={() => navigate(ROUTES.terms)}><FileText aria-hidden />使用條款</UtilityButton>
          <UtilityLink href={GITHUB_ISSUES_URL} target="_blank" rel="noopener noreferrer"><MessageCircleWarning aria-hidden />回報問題<ArrowUpRight className="external" aria-hidden /></UtilityLink>
          <UtilityLink href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer"><Github aria-hidden />原始碼<ArrowUpRight className="external" aria-hidden /></UtilityLink>
        </UtilityPanel>
      </Section>
    </>
  );
}

export default NavGrid;
