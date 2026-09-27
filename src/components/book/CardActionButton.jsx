import styled from 'styled-components';
import { spin } from '../../utils/styled/animations';

/** Monochrome icons; only destructive actions pick up a hue, and only on hover. */
function actionHoverColor(variant) {
  return variant === 'delete' ? 'var(--toast-error-color)' : 'var(--accent-color)';
}

export const CardActionButton = styled.button`
  padding: 8px;
  min-width: 36px;
  min-height: 36px;
  border-radius: ${(p) => (p.$compact ? 'var(--border-radius-xs)' : 'var(--border-radius-sm)')};
  border: 1px solid transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: var(--transition-default);
  background: transparent;
  color: var(--text-color-secondary);

  &:hover:not(:disabled) {
    background: var(--hover-background-color);
    color: ${(p) => actionHoverColor(p.$variant)};
  }

  &:active:not(:disabled) {
    transform: scale(0.94);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: ${(p) => (p.$compact ? 0.6 : 0.7)};
  }

  svg {
    width: ${(p) => (p.$compact ? '16px' : '18px')};
    height: ${(p) => (p.$compact ? '16px' : '18px')};
  }
`;

export const CardSpinningIcon = styled.span`
  display: flex;
  will-change: transform;
  animation: ${spin} ${(p) => p.$duration ?? '0.8s'} linear infinite;
`;

export const CardLoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--background-color) 80%, transparent);
  backdrop-filter: blur(4px);
  border-radius: inherit;
  z-index: 10;

  svg {
    width: ${(p) => p.$iconSize ?? 40}px;
    height: ${(p) => p.$iconSize ?? 40}px;
    color: var(--accent-color);
    will-change: transform;
    animation: ${spin} 0.8s linear infinite;
  }
`;
