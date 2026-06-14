import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { IconButton } from './IconButton';

const Wrapper = styled.div`
  position: relative;
`;

const Menu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  max-width: calc(100vw - 32px);
  max-height: 280px;
  overflow-y: auto;
  background-color: rgba(18, 18, 18, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 1100;
  padding: 8px;
`;

const Option = styled.button`
  display: block;
  width: 100%;
  padding: 10px 12px;
  text-align: left;
  font-size: 14px;
  color: var(--text-color);
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  font-family: ${(p) => p.$fontFamily ?? 'inherit'};

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-background-color);
      color: var(--accent-color);
    }
  }

  ${(p) =>
    p.$active &&
    `
    color: var(--accent-color);
    font-weight: 600;
  `}
`;

/**
 * Reusable icon dropdown for selecting from a list of options.
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Lucide icon component (e.g. <Type size={20} />)
 * @param {string} props.title - Tooltip for the trigger button
 * @param {string} props.ariaLabel - Aria label for the menu
 * @param {Array<{value: string, label: string, fontFamily?: string}>} props.options - Options { value, label, fontFamily? }
 * @param {string} props.value - Current selected value
 * @param {function(string): void} props.onChange - Called when an option is selected
 */
function IconDropdown({ icon, title, ariaLabel, options, value, onChange, disabled = false }) {
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
              $fontFamily={opt.fontFamily ?? opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </Option>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
}

export default IconDropdown;
