import React from 'react';
import styled from 'styled-components';

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 900px) {
    gap: 0;
  }
`;

export const ActionBarSeparator = styled.span`
  width: 1px;
  height: 24px;
  background: var(--border-color);
  flex-shrink: 0;
  margin: 0 4px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 900px) {
    gap: 0;

    button {
      background: none;
      border: none;
      box-shadow: none;
      color: var(--text-color-secondary);
      border-radius: 12px;

      @media (hover: hover) {
        &:hover:not(:disabled) {
          background-color: var(--hover-background-color);
          color: var(--accent-color);
          transform: none;
          box-shadow: none;
          border-color: transparent;
        }
      }

      &:active:not(:disabled) {
        transform: none;
        box-shadow: none;
      }
    }
  }
`;

function ActionBar({ pinnedStart, pinnedEnd, children }) {
  return (
    <RightActions>
      {pinnedStart && <ActionsGroup>{pinnedStart}</ActionsGroup>}
      {pinnedStart && <ActionBarSeparator aria-hidden="true" />}
      <ActionsGroup>{children}</ActionsGroup>
      {pinnedEnd && <ActionBarSeparator aria-hidden="true" />}
      {pinnedEnd && <ActionsGroup>{pinnedEnd}</ActionsGroup>}
    </RightActions>
  );
}

export default ActionBar;
