import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import styled from 'styled-components';

const SortWrapper = styled.div`
  position: fixed;
  z-index: 1000;
  right: 24px;
  bottom: 24px;

  @media (max-width: 480px) {
    right: 16px;
    bottom: calc(16px + env(safe-area-inset-bottom));
  }

  button {
    display: flex;
    padding: 14px;
    min-width: 52px;
    min-height: 52px;
    border-radius: 50%;
    background-color: var(--accent-color);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    svg {
      width: 24px;
      height: 24px;
      color: #000000;
    }

    &:hover {
      background-color: var(--accent-hover);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
    }

    &:active {
      transform: translateY(0);
    }
  }
`;

function Sort({ onSortChange }) {
  const handleSortClick = () => {
    onSortChange();
  };

  return (
    <SortWrapper>
      <button onClick={handleSortClick}>
        <ArrowUpDown size={24} strokeWidth={2} />
      </button>
    </SortWrapper>
  );
}

export default Sort;
