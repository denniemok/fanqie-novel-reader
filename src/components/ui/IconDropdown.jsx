import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Pencil } from 'lucide-react';
import styled from 'styled-components';
import { IconButton } from './IconButton';
import ApiOverallBadge from '../settings/ApiOverallBadge';
import { thinScrollbarStyles } from '../../utils/styled/scrollbars';

const Wrapper = styled.div`
  position: relative;
`;

const Menu = styled.div`
  position: fixed;
  min-width: 220px;
  max-width: calc(100vw - 32px);
  max-height: min(280px, calc(100dvh - 32px));
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--dropdown-bg);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  box-shadow: var(--panel-shadow);
  z-index: 1300;
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

  ${(p) =>
    p.$inRow &&
    `
    flex: 1;
    width: auto;
    min-width: 0;
    background: transparent;

    @media (hover: hover) {
      &:hover {
        background: transparent;
      }
    }
  `}
`;

const OptionLabel = styled.span`
  min-width: 0;
  flex: 1;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  border-radius: var(--border-radius-xs);

  ${(p) =>
    p.$active &&
    `
    background-color: var(--accent-soft);
  `}

  @media (hover: hover) {
    &:hover {
      background-color: var(--hover-background-color);
    }
  }
`;

const OptionEdit = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin-right: 4px;
  padding: 0;
  border: none;
  border-radius: var(--border-radius-xs);
  background: transparent;
  color: var(--text-color-secondary);
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      color: var(--accent-color);
      background: var(--accent-soft);
    }
  }
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

function getMenuStyle(anchor, placement) {
  const rect = anchor.getBoundingClientRect();
  const gap = 8;
  const viewportPadding = 16;
  const maxMenuHeight = Math.min(280, window.innerHeight - viewportPadding * 2);

  if (placement === 'left') {
    const top = Math.min(
      Math.max(viewportPadding, rect.top),
      window.innerHeight - maxMenuHeight - viewportPadding,
    );
    return {
      top: `${top}px`,
      right: `${window.innerWidth - rect.left + gap}px`,
      left: 'auto',
      maxHeight: `${maxMenuHeight}px`,
    };
  }

  let top = rect.bottom + gap;
  if (top + maxMenuHeight > window.innerHeight - viewportPadding) {
    top = Math.max(viewportPadding, rect.top - maxMenuHeight - gap);
  }

  return {
    top: `${top}px`,
    right: `${window.innerWidth - rect.right}px`,
    left: 'auto',
    maxHeight: `${maxMenuHeight}px`,
  };
}

/**
 * Reusable icon dropdown for selecting from a list of options.
 */
function IconDropdown({
  icon,
  title,
  ariaLabel,
  options,
  value,
  onChange,
  disabled = false,
  footer,
  menuPlacement = 'bottom',
  onEditOption,
}) {
  const [open, setOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState(null);
  const ref = useRef(null);
  const menuRef = useRef(null);

  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle(null);
      return undefined;
    }

    const updateMenuPosition = () => {
      if (!ref.current) return;
      setMenuStyle(getMenuStyle(ref.current, menuPlacement));
    };

    updateMenuPosition();
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);
    return () => {
      window.removeEventListener('resize', updateMenuPosition);
      window.removeEventListener('scroll', updateMenuPosition, true);
    };
  }, [open, menuPlacement]);

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (e) => {
      if (ref.current?.contains(e.target) || menuRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const menu = open && !disabled && menuStyle && (
    <Menu ref={menuRef} role="listbox" aria-label={ariaLabel} style={menuStyle}>
      {options.map((opt) => {
        const edit = onEditOption?.(opt);
        const selected = value === opt.value;
        const option = (
          <Option
            role="option"
            aria-selected={selected}
            $active={selected}
            $fontFamily={opt.fontFamily}
            $inRow={Boolean(edit)}
            onClick={() => {
              onChange(opt.value);
              setOpen(false);
            }}
          >
            <OptionLabel>{opt.label}</OptionLabel>
            {opt.status && <ApiOverallBadge status={opt.status} compact />}
          </Option>
        );

        if (!edit) return <React.Fragment key={opt.value}>{option}</React.Fragment>;

        return (
          <OptionRow key={opt.value} $active={selected}>
            {option}
            <OptionEdit
              type="button"
              title={edit.title}
              aria-label={edit.title}
              onClick={(e) => {
                e.stopPropagation();
                edit.onClick();
                setOpen(false);
              }}
            >
              <Pencil size={14} strokeWidth={2.25} aria-hidden />
            </OptionEdit>
          </OptionRow>
        );
      })}
      {footer && (
        <>
          <MenuDivider />
          {typeof footer === 'function' ? footer(() => setOpen(false)) : footer}
        </>
      )}
    </Menu>
  );

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
      {menu && createPortal(menu, document.body)}
    </Wrapper>
  );
}

export { MenuFooterButton };
export default IconDropdown;
