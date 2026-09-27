import styled, { css } from 'styled-components';

export const homeNoticeStyles = css`
  width: 100%;
  margin-bottom: 16px;
  box-sizing: border-box;
  padding: 16px 20px;
  background: var(--surface-raised);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: var(--retro-border-width) solid var(--border-color);
  border-left: 3px solid var(--accent-color);
  border-radius: var(--border-radius-sm);
  font-size: 14px;
  line-height: 1.8;
  color: var(--text-color);
  animation: fadeInUp 0.5s var(--ease-out) backwards;
`;

export const HomeNotice = styled.div`
  ${homeNoticeStyles}
`;

export const HomeNoticeLabel = styled.strong`
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: var(--accent-color);
`;
