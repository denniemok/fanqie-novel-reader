import { css } from 'styled-components';

export const retroGlassBorder = css`
  border: var(--retro-border-width) solid color-mix(in srgb, var(--border-color) 85%, transparent);
`;

export const retroGlassSurface = css`
  background: color-mix(in srgb, var(--background-color2) 48%, transparent);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
`;

export const retroShadowUnit = css`
  box-shadow: var(--retro-shadow);
  transition: all 0.1s steps(2);
`;

/** Shared border + shadow + hover lift for toolbar groupings (tabs, search bar). */
export const toolbarRetroUnit = css`
  ${retroGlassBorder}
  ${retroShadowUnit}

  @media (hover: hover) {
    &:hover {
      border-color: var(--accent-color);
      transform: translate(-1px, -1px);
      box-shadow: var(--retro-shadow-hover);
    }
  }
`;

/** Retro glass control base for square nav buttons and dropdown triggers. */
export const retroGlassControlBase = css`
  ${retroGlassBorder}
  ${retroGlassSurface}
  ${retroShadowUnit}
`;

export const retroGlassControlHover = css`
  &:hover:not(:disabled) {
    background: color-mix(in srgb, var(--catalog-glass-hover) 75%, transparent);
    border-color: var(--accent-color);
    color: var(--accent-color);
    transform: translate(-1px, -1px);
    box-shadow: var(--retro-shadow-hover);
  }

  &:active:not(:disabled) {
    transform: translate(1px, 1px);
    box-shadow: none;
  }
`;

/** Retro glass button with hover/active lift (dropdown triggers, icon buttons). */
export const retroGlassButtonStyles = css`
  ${retroGlassControlBase}

  &:hover,
  &:focus {
    border-color: var(--accent-color);
    transform: translate(-1px, -1px);
    box-shadow: var(--retro-shadow-hover);
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: var(--retro-shadow);
  }
`;

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

export const retroTagCardStyles = css`
  ${retroDashedCardStyles}
  ${retroTagStyles}
`;

export const catalogPanelShell = css`
  border-radius: var(--border-radius-sm);
  border: var(--retro-border-width) solid color-mix(in srgb, var(--border-color) 75%, transparent);
  box-shadow: var(--retro-shadow);
  background: var(--catalog-glass-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  overflow: hidden;
`;

export const catalogInsetBarSurface = css`
  background: color-mix(in srgb, var(--background-color2) 35%, transparent);
`;

export const catalogDashedDividerBottom = css`
  border-bottom: 1px dashed color-mix(in srgb, var(--border-color) 80%, transparent);
`;

export const catalogDashedDividerTop = css`
  border-top: 1px dashed color-mix(in srgb, var(--border-color) 80%, transparent);
`;
