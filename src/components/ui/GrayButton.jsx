import styled from 'styled-components';

export const GrayButton = styled.button`
  padding: 10px 22px;
  font-size: 0.95rem;
  font-family: var(--ui-font-family);
  color: var(--text-color);
  background: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius-sketch);
  cursor: pointer;
  transition: var(--transition-default);
  font-weight: 500;
  letter-spacing: 0.06em;

  &:hover {
    background: var(--hover-background-color);
    color: var(--accent-color);
    border-color: var(--border-strong);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;
