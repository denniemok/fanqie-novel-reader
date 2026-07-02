import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { BookOpen, Compass, Megaphone, MessageCircleWarning, Info, Github, Download, Activity } from 'lucide-react';
import { GITHUB_ISSUES_URL, GITHUB_README_URL, GITHUB_REPO_URL } from '../../utils/constants';
import { ROUTES, buildDefaultDiscoverUrl } from '../../utils/navigation';

const ICON_SIZE = 40;

const staggerDelays = [0.08, 0.14, 0.2, 0.26, 0.32, 0.38, 0.44, 0.5];

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  width: 100%;

  & > * {
    animation: fadeInUp 0.55s cubic-bezier(0.34, 1.4, 0.64, 1) backwards;
  }

  & > *:nth-child(1) { animation-delay: ${staggerDelays[0]}s; }
  & > *:nth-child(2) { animation-delay: ${staggerDelays[1]}s; }
  & > *:nth-child(3) { animation-delay: ${staggerDelays[2]}s; }
  & > *:nth-child(4) { animation-delay: ${staggerDelays[3]}s; }
  & > *:nth-child(5) { animation-delay: ${staggerDelays[4]}s; }
  & > *:nth-child(6) { animation-delay: ${staggerDelays[5]}s; }
  & > *:nth-child(7) { animation-delay: ${staggerDelays[6]}s; }
  & > *:nth-child(8) { animation-delay: ${staggerDelays[7]}s; }

  @media (max-width: 700px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }

  @media (max-width: 400px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const tileStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 22px 12px;
  aspect-ratio: 1 / 1;
  background: var(--card-surface);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition-default);
  box-shadow: var(--retro-shadow);
  width: 100%;
  min-width: 0;
  font-family: inherit;
  color: inherit;
  text-decoration: none;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, var(--accent-soft) 0%, transparent 65%);
    opacity: 0.45;
    pointer-events: none;
  }

  & > svg {
    width: ${ICON_SIZE}px;
    height: ${ICON_SIZE}px;
    color: var(--accent-color);
    flex-shrink: 0;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 0.28s cubic-bezier(0.34, 1.4, 0.64, 1), color 0.2s ease;
    position: relative;
    z-index: 1;
  }

  & > span {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    min-width: 0;
  }

  @media (max-width: 700px) {
    aspect-ratio: auto;
    min-height: 112px;
    padding: 14px 10px;
    gap: 6px;

    & > svg {
      width: 32px;
      height: 32px;
    }
  }

  @media (min-width: 701px) {
    padding: 20px 10px;
  }

  @media (hover: hover) {
    &:hover {
      transform: translate(-3px, -3px) rotate(-1deg);
      border-color: var(--accent-color);
      box-shadow: var(--retro-shadow-hover);

      & > svg {
        color: var(--accent-hover);
        transform: scale(1.08) rotate(-3deg);
      }
    }
  }

  &:active {
    transform: translate(1px, 1px) rotate(0deg);
    box-shadow: none;
  }
`;

const TileButton = styled.button`${tileStyles}`;

const TileLink = styled.a`${tileStyles}`;

const TileLabel = styled.span`
  font-size: 17px;
  font-weight: 600;
  font-family: var(--display-font-family);
  color: var(--text-color);
  letter-spacing: 0.06em;
  text-align: center;
  line-height: 1.25;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (max-width: 700px) {
    font-size: 15px;
    letter-spacing: 0.04em;
  }
`;

const TileSubLabel = styled.span`
  font-size: 12px;
  color: var(--text-color-secondary);
  letter-spacing: 0.02em;
  text-align: center;
  line-height: 1.35;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 700px) {
    font-size: 11px;
    line-height: 1.3;
    -webkit-line-clamp: 1;
  }
`;

function NavGrid() {
  const navigate = useNavigate();

  return (
    <Grid>
      <TileButton type="button" onClick={() => navigate(ROUTES.bookshelf)}>
        <BookOpen size={ICON_SIZE} strokeWidth={2} aria-hidden />
        <TileLabel>書架</TileLabel>
        <TileSubLabel>閱讀歷史與收藏</TileSubLabel>
      </TileButton>
      <TileButton type="button" onClick={() => navigate(buildDefaultDiscoverUrl())}>
        <Compass size={ICON_SIZE} strokeWidth={2} aria-hidden />
        <TileLabel>新書</TileLabel>
        <TileSubLabel>開始新閱讀</TileSubLabel>
      </TileButton>
      <TileButton type="button" onClick={() => navigate(ROUTES.download)}>
        <Download size={ICON_SIZE} strokeWidth={2} aria-hidden />
        <TileLabel>下載</TileLabel>
        <TileSubLabel>下載管理與說明</TileSubLabel>
      </TileButton>
      <TileButton type="button" onClick={() => navigate(ROUTES.status)}>
        <Activity size={ICON_SIZE} strokeWidth={2} aria-hidden />
        <TileLabel>API 狀態</TileLabel>
        <TileSubLabel>鏡像源健康檢測</TileSubLabel>
      </TileButton>
      <TileButton type="button" onClick={() => navigate(ROUTES.announcements)}>
        <Megaphone size={ICON_SIZE} strokeWidth={2} aria-hidden />
        <TileLabel>公告</TileLabel>
        <TileSubLabel>更新與通知</TileSubLabel>
      </TileButton>
      <TileLink href={GITHUB_ISSUES_URL} target="_blank" rel="noopener noreferrer">
        <MessageCircleWarning size={ICON_SIZE} strokeWidth={2} aria-hidden />
        <TileLabel>回報</TileLabel>
        <TileSubLabel>問題回報</TileSubLabel>
      </TileLink>
      <TileLink href={GITHUB_README_URL} target="_blank" rel="noopener noreferrer">
        <Info size={ICON_SIZE} strokeWidth={2} aria-hidden />
        <TileLabel>關於我們</TileLabel>
        <TileSubLabel>專案介紹</TileSubLabel>
      </TileLink>
      <TileLink href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
        <Github size={ICON_SIZE} strokeWidth={2} aria-hidden />
        <TileLabel>原始碼</TileLabel>
        <TileSubLabel>GitHub 倉庫</TileSubLabel>
      </TileLink>
    </Grid>
  );
}

export default NavGrid;
