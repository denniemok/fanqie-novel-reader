import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { IconButton } from './IconButton';
import ApiOverallBadge from './ApiOverallBadge';
import { thinScrollbarStyles } from '../../utils/styled/scrollbars';

const Wrapper = styled.div`
  position: relative;
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  max-width: calc(100vw - 32px);
  max-height: 280px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--dropdown-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--panel-shadow);
  z-index: 1100;
  padding: 4px;
  ${thinScrollbarStyles}
`;

const Option = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  font-size: 14px;
  color: var(--text-color);
  background: none;
  border: none;
  border-radius: var(--border-radius-xs);
  cursor: pointer;
  transition: background 0.2s;
  font-family: ${(p) => p.$fontFamily ?? 'var(--ui-font-family)'};

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-background-color);
      color: var(--accent-color);
    }
  }

  ${(p) =>
    p.$active &&
    `
    background-color: var(--accent-soft);
    color: var(--accent-color);
    font-weight: 600;
  `}
`;

const OptionLabel = styled.span`
  min-width: 0;
  flex: 1;
`;

const MenuDivider = styled.div`
  height: 1px;
  margin: 4px 8px;
  background: var(--border-color);
`;

const MenuFooterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  font-size: 14px;
  font-family: var(--ui-font-family);
  color: var(--text-color-secondary);
  background: none;
  border: none;
  border-radius: var(--border-radius-xs);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  svg {
    flex-shrink: 0;
    color: var(--accent-color);
  }

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-background-color);
      color: var(--accent-color);
    }
  }
`;

/**
 * Reusable icon dropdown for selecting from a list of options.
 */
function IconDropdown({ icon, title, ariaLabel, options, value, onChange, disabled = false, footer }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <Wrapper ref={ref}>
      <IconButton
        type="button"
        title={title}
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {icon}
      </IconButton>
      {open && !disabled && (
        <Menu role="listbox" aria-label={ariaLabel}>
          {options.map((opt) => (
            <Option
              key={opt.value}
              role="option"
              aria-selected={value === opt.value}
              $active={value === opt.value}
              $fontFamily={opt.fontFamily}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <OptionLabel>{opt.label}</OptionLabel>
              {opt.status && <ApiOverallBadge status={opt.status} compact />}
            </Option>
          ))}
          {footer && (
            <>
              <MenuDivider />
              {typeof footer === 'function' ? footer(() => setOpen(false)) : footer}
            </>
          )}
        </Menu>
      )}
    </Wrapper>
  );
}

export { MenuFooterButton };
export default IconDropdown;
