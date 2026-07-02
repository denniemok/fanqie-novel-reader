import styled, { css } from 'styled-components';
import { retroGlassControlBase, retroGlassControlHover } from '../../utils/styled/retro';

const solidStyles = css`
  background: var(--card-surface);
  border: var(--retro-border-width) solid var(--border-color);
  box-shadow: var(--retro-shadow);

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: ${(p) => (p.$active ? 'var(--accent-hover)' : 'var(--accent-color)')};
      color: var(--text-on-accent);
      border-color: ${(p) => (p.$active ? 'var(--accent-hover)' : 'var(--accent-color)')};
      transform: translate(-1px, -1px) rotate(-1deg);
      box-shadow: var(--retro-shadow-hover);
    }
  }
`;

const glassStyles = css`
  ${retroGlassControlBase}

  @media (hover: hover) {
    &:hover:not(:disabled) {
      ${retroGlassControlHover}
      background: color-mix(in srgb, var(--accent-soft) 80%, transparent);
      color: var(--accent-color);
    }
  }
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  min-width: 44px;
  min-height: 44px;
  color: var(--text-color);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: var(--transition-default);

  ${(p) => (p.$variant === 'glass' ? glassStyles : solidStyles)}

  ${(p) =>
    p.$active &&
    `
    background: var(--accent-color);
    border-color: var(--accent-color);
    color: var(--text-on-accent);
  `}

  ${(p) =>
    p.$active &&
    p.$variant === 'glass' &&
    `
    @media (hover: hover) {
      &:hover:not(:disabled) {
        background: var(--accent-hover);
        border-color: var(--accent-hover);
        color: var(--text-on-accent);
      }
    }
  `}

  &:active:not(:disabled) {
    transform: translate(1px, 1px);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    box-shadow: none;
  }
`;
