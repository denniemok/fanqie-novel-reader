import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const IconLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  min-width: 44px;
  min-height: 44px;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 0;
  border: 1px solid var(--border-color);
  background: var(--background-color2);
  box-shadow: 2px 2px 0px var(--background-color);
  transition: all 0.1s steps(2);

  @media (hover: hover) {
    &:hover {
      background-color: var(--accent-color);
      color: #000;
      border-color: var(--accent-color);
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0px #000;
    }
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: 0px 0px 0px #000;
  }

  @media (max-width: 480px) {
    min-width: 40px;
    min-height: 40px;
    padding: 8px;
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
  background: var(--background-color2);
  border: 1px solid var(--border-color);
  border-radius: 0;
  cursor: pointer;
  transition: all 0.1s steps(2);
  box-shadow: 2px 2px 0px var(--background-color);

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background-color: var(--accent-color);
      color: #000;
      border-color: var(--accent-color);
      transform: translate(-1px, -1px);
      box-shadow: 3px 3px 0px #000;
    }
  }

  &:active:not(:disabled) {
    transform: translate(1px, 1px);
    box-shadow: 0px 0px 0px #000;
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    box-shadow: none;
  }

  @media (max-width: 480px) {
    min-width: 40px;
    min-height: 40px;
    padding: 8px;
  }
`;
