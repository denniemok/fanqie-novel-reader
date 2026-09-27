import { css } from 'styled-components';

/*
 * Shared surface/control mixins. Flat by design: structure comes from hairline
 * borders and tinted fills; hover never lifts or rotates, it only tints.
 */

const retroGlassBorder = css`
  border: var(--retro-border-width) solid var(--border-color);
`;

const retroGlassSurface = css`
  background: var(--surface-muted);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
`;

const retroShadowUnit = css`
  transition: var(--transition-default);
`;

/** Shared border + hover tint for toolbar groupings (tabs, search bar). */
export const toolbarRetroUnit = css`
  ${retroGlassBorder}
  ${retroShadowUnit}

  @media (hover: hover) {
    &:hover {
      border-color: var(--border-strong);
    }
  }
`;

/** Glass control base for square nav buttons and dropdown triggers. */
export const retroGlassControlBase = css`
  ${retroGlassBorder}
  ${retroGlassSurface}
  ${retroShadowUnit}
`;

export const retroGlassControlHover = css`
  &:hover:not(:disabled) {
    background: var(--surface-raised);
    border-color: var(--border-strong);
    color: var(--accent-color);
  }
`;

/** Glass button with hover/focus tint (dropdown triggers). */
export const retroGlassButtonStyles = css`
  ${retroGlassControlBase}

  &:hover,
  &:focus-visible {
    border-color: var(--border-strong);
    background: var(--surface-raised);
  }
`;

export const retroCardStyles = css`
  padding: 20px 22px;
  background: var(--card-surface);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: var(--border-radius);
  border: var(--retro-border-width) solid var(--border-color);
  font-size: 14px;
  color: var(--text-color);
  line-height: 1.8;
`;

const retroTagStyles = css`
  b {
    display: inline-block;
    color: var(--accent-color);
    font-weight: 600;
    font-size: 12px;
    letter-spacing: 0.06em;
    background: var(--accent-soft);
    padding: 1px 8px;
    border-radius: var(--border-radius-xs);
    margin-right: 4px;
  }
`;

export const retroTagCardStyles = css`
  ${retroCardStyles}
  ${retroTagStyles}
`;

export const catalogPanelShell = css`
  border-radius: var(--border-radius);
  border: var(--retro-border-width) solid var(--border-color);
  background: var(--catalog-glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  overflow: hidden;
`;

export const catalogInsetBarSurface = css`
  background: color-mix(in srgb, var(--background-color) 45%, transparent);
`;

export const catalogDividerBottom = css`
  border-bottom: 1px solid var(--border-color);
`;

export const catalogDividerTop = css`
  border-top: 1px solid var(--border-color);
`;
