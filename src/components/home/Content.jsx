import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { BookOpen, PlusCircle, Megaphone, MessageCircleWarning } from 'lucide-react';
import { GITHUB_ISSUES_URL } from '../../utils/constants';

const ICON_SIZE = 40;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 0 24px 24px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 0 16px 20px;
  }
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  width: 100%;

  @media (min-width: 600px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
`;

const tileStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 22px 12px;
  aspect-ratio: 1 / 1;
  background-color: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  cursor: pointer;
  transition: all 0.1s steps(2);
  box-shadow: var(--retro-shadow);
  width: 100%;
  min-width: 0;
  font-family: inherit;
  color: inherit;
  text-decoration: none;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;

  & > svg {
    width: ${ICON_SIZE}px;
    height: ${ICON_SIZE}px;
    color: var(--accent-color);
    flex-shrink: 0;
  }

  @media (min-width: 600px) {
    padding: 20px 10px;
  }

  @media (hover: hover) {
    &:hover {
      transform: translate(-2px, -2px);
      border-color: var(--accent-color);
      background-color: var(--hover-background-color);
      box-shadow: 6px 6px 0px var(--background-color);

      & > svg {
        color: var(--accent-hover);
      }
    }
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 0px 0px 0px var(--background-color);
  }
`;

const BigButton = styled.button`${tileStyles}`;

const BigLink = styled.a`${tileStyles}`;

const ButtonLabel = styled.span`
  font-size: 18px;
  font-weight: 900;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: center;
  line-height: 1.2;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ButtonSubLabel = styled.span`
  font-size: 12px;
  color: var(--text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  opacity: 0.75;
  text-align: center;
  line-height: 1.3;
  width: 100%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

function Content() {
  const navigate = useNavigate();

  return (
    <ContentWrapper>
      <ButtonGrid>
        <BigButton type="button" onClick={() => navigate('/bookshelf')}>
          <BookOpen size={ICON_SIZE} strokeWidth={2} aria-hidden />
          <ButtonLabel>書架</ButtonLabel>
          <ButtonSubLabel>閱讀歷史 · 收藏</ButtonSubLabel>
        </BigButton>
        <BigButton type="button" onClick={() => navigate('/new-book')}>
          <PlusCircle size={ICON_SIZE} strokeWidth={2} aria-hidden />
          <ButtonLabel>新書</ButtonLabel>
          <ButtonSubLabel>開始新閱讀</ButtonSubLabel>
        </BigButton>
        <BigButton type="button" onClick={() => navigate('/announcements')}>
          <Megaphone size={ICON_SIZE} strokeWidth={2} aria-hidden />
          <ButtonLabel>公告</ButtonLabel>
          <ButtonSubLabel>更新與通知</ButtonSubLabel>
        </BigButton>
        <BigLink href={GITHUB_ISSUES_URL} target="_blank" rel="noopener noreferrer">
          <MessageCircleWarning size={ICON_SIZE} strokeWidth={2} aria-hidden />
          <ButtonLabel>回報</ButtonLabel>
          <ButtonSubLabel>問題回報</ButtonSubLabel>
        </BigLink>
      </ButtonGrid>
    </ContentWrapper>
  );
}

export default Content;
