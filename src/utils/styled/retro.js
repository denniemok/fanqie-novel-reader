import { css } from 'styled-components';

export const retroDashedCardStyles = css`
  padding: 18px 20px;
  background: var(--card-surface);
  border-radius: var(--border-radius-sm);
  border: var(--retro-border-width) dashed var(--border-color);
  font-size: 14px;
  color: var(--text-color);
  line-height: 1.65;
  box-shadow: var(--retro-shadow);
`;

export const retroTagStyles = css`
  b {
    display: inline-block;
    color: var(--accent-color);
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.04em;
    background: var(--accent-soft);
    padding: 2px 8px;
    border-radius: var(--border-radius-xs);
    margin-right: 4px;
  }
`;
