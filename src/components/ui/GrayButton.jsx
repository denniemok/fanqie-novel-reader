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
  box-shadow: var(--retro-shadow);
  font-weight: 500;
  letter-spacing: 0.04em;

  &:hover {
    background: var(--accent-color);
    color: var(--text-on-accent);
    border-color: var(--accent-color);
    transform: translate(-2px, -2px) rotate(-0.5deg);
    box-shadow: var(--retro-shadow-hover);
  }

  &:active {
    transform: translate(1px, 1px) rotate(0deg);
    box-shadow: none;
  }

  &:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
`;
