import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import styled from 'styled-components';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import Toolbox from './Toolbox';

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

const CollapsibleActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const PinnedActions = styled.div`
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

const ToolboxToggle = styled.button`
  display: none;
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

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-background-color);
      color: var(--accent-color);
    }
  }

  @media (max-width: 900px) {
    display: flex;
  }
`;

function ActionBar({ pinnedStart, pinnedEnd, children }) {
  const [toolboxOpen, setToolboxOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 900px)');

  return (
    <>
      <RightActions>
        {pinnedStart && <PinnedActions>{pinnedStart}</PinnedActions>}
        {isMobile ? (
          <>
            {pinnedEnd && <ActionBarSeparator aria-hidden="true" />}
            {pinnedEnd && <PinnedActions>{pinnedEnd}</PinnedActions>}
            <ToolboxToggle type="button" title="工具" onClick={() => setToolboxOpen(true)}>
              <Menu size={20} strokeWidth={2.5} />
            </ToolboxToggle>
          </>
        ) : (
          <>
            {pinnedStart && <ActionBarSeparator aria-hidden="true" />}
            <CollapsibleActions>{children}</CollapsibleActions>
            {pinnedEnd && <ActionBarSeparator aria-hidden="true" />}
            {pinnedEnd}
          </>
        )}
      </RightActions>
      {isMobile && (
        <Toolbox open={toolboxOpen} onClose={() => setToolboxOpen(false)}>
          {children}
        </Toolbox>
      )}
    </>
  );
}

export default ActionBar;
