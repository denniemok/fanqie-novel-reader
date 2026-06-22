import { css } from 'styled-components';

export const thinScrollbarStyles = css`
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 0;
  }

  @media (hover: hover) {
    &::-webkit-scrollbar-thumb:hover {
      background: var(--accent-color);
    }
  }
`;

export const modalScrollbarStyles = css`
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--accent-color) 45%, var(--border-color)) transparent;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: color-mix(in srgb, var(--accent-color) 35%, var(--border-color));
    border-radius: 999px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  @media (hover: hover) {
    &::-webkit-scrollbar-thumb:hover {
      background: color-mix(in srgb, var(--accent-color) 65%, var(--border-color));
      background-clip: padding-box;
    }
  }
`;
