import styled, { css } from 'styled-components';

export const homeNoticeStyles = css`
  width: 100%;
  margin-bottom: 16px;
  box-sizing: border-box;
  padding: 14px 16px;
  background: color-mix(in srgb, var(--accent-color) 8%, var(--background-color2));
  border: var(--retro-border-width) solid color-mix(in srgb, var(--accent-color) 55%, var(--border-color));
  border-radius: var(--border-radius-sm);
  box-shadow: var(--retro-shadow);
  font-size: 14px;
  line-height: 1.65;
  color: var(--text-color);
  animation: fadeInUp 0.5s cubic-bezier(0.34, 1.4, 0.64, 1) backwards;
`;

export const HomeNotice = styled.div`
  ${homeNoticeStyles}
`;

export const HomeNoticeLabel = styled.strong`
  display: block;
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--accent-color);
`;
