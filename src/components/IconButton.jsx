import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const IconLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  min-width: 44px;
  min-height: 44px;
  color: var(--text-color-secondary);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--hover-background-color);
    color: var(--accent-color);
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
  color: var(--text-color-secondary);
  background: none;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: var(--hover-background-color);
    color: var(--accent-color);
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    min-width: 40px;
    min-height: 40px;
    padding: 8px;
  }
`;
