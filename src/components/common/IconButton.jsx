import styled from 'styled-components';

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  min-width: 44px;
  min-height: 44px;
  color: var(--text-color);
  background: var(--card-surface);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: var(--transition-default);
  box-shadow: var(--retro-shadow);

  ${(p) =>
    p.$active &&
    `
    background: var(--accent-color);
    border-color: var(--accent-color);
    color: var(--text-on-accent);
  `}

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: ${(p) => (p.$active ? 'var(--accent-hover)' : 'var(--accent-color)')};
      color: var(--text-on-accent);
      border-color: ${(p) => (p.$active ? 'var(--accent-hover)' : 'var(--accent-color)')};
      transform: translate(-1px, -1px) rotate(-1deg);
      box-shadow: var(--retro-shadow-hover);
    }
  }

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
