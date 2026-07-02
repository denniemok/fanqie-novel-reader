import styled from 'styled-components';
import { spin } from '../../utils/styled/animations';

function actionVariantBg(variant) {
  if (variant === 'delete') return '#e8a0a8';
  if (variant === 'refresh') return '#a0c8e8';
  if (variant === 'collection') return '#e8d0a0';
  if (variant === 'download') return '#a8d8a8';
  if (variant === 'export') return '#c8b8e8';
  return 'var(--background-color2)';
}

export const CardActionButton = styled.button`
  padding: 8px;
  min-width: 36px;
  min-height: 36px;
  border-radius: ${(p) => (p.$compact ? 'var(--border-radius-xs)' : 'var(--border-radius-sm)')};
  border: 1px solid var(--border-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.1s steps(2);
  background-color: ${(p) => actionVariantBg(p.$variant)};
  color: ${(p) => (p.$variant ? 'var(--text-on-accent)' : 'var(--text-color)')};
  box-shadow: var(--retro-shadow);

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: var(--retro-shadow-hover);
    filter: brightness(1.08);
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: none;
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
  background: rgba(240, 233, 228, 0.88);
  backdrop-filter: blur(4px);
  border-radius: var(--border-radius-sm);
  z-index: 10;

  svg {
    width: ${(p) => p.$iconSize ?? 40}px;
    height: ${(p) => p.$iconSize ?? 40}px;
    color: var(--accent-color);
    will-change: transform;
    animation: ${spin} 0.8s linear infinite;
  }
`;
