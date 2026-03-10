import styled from 'styled-components';

export const GrayButton = styled.button`
  padding: 10px 20px;
  font-size: 0.9rem;
  color: var(--text-color);
  background: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: 0;
  cursor: pointer;
  transition: all 0.1s steps(2);
  box-shadow: var(--retro-shadow);
  text-transform: uppercase;
  font-weight: 900;

  &:hover {
    background: var(--accent-color);
    color: #000;
    border-color: var(--accent-color);
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0px #000;
  }

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 0px 0px 0px #000;
  }
`;
