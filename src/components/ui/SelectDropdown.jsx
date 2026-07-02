import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import styled, { css } from 'styled-components';
import { thinScrollbarStyles } from '../../utils/styled/scrollbars';
import { retroGlassButtonStyles } from '../../utils/styled/retro';
import { DropdownOptionLine } from '../../utils/styled/dropdown';

const MENU_GAP = 8;
const MENU_MAX_HEIGHT = 280;
const MENU_PORTAL_Z_INDEX = 1300;
const MENU_ROW_HEIGHT = 48;

const SelectWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: stretch;
  height: ${(p) => (p.$embedded ? '100%' : 'auto')};
  ${(p) => p.$open && !p.$menuPortal && 'z-index: 50;'}

  ${(p) =>
    p.$attached &&
    !p.$embedded &&
    !p.$retro &&
    `
    border: 1px solid var(--border-color);
    border-radius: ${p.$square ? '0' : 'var(--border-radius-sm)'};
    transition: border-color 0.2s ease;

    &:hover,
    &:focus-within {
      border-color: var(--accent-color);
    }
  `}
`;

const AttachedLabel = styled.span`
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-right: 1px solid var(--border-color);
  font-size: 14px;
  font-weight: 700;
  font-family: var(--ui-font-family);
  color: var(--text-color-secondary);
  background: var(--background-color2);
  border-radius: ${(p) => (p.$square ? '0' : 'var(--border-radius-sm) 0 0 var(--border-radius-sm)')};
  white-space: nowrap;
  flex-shrink: 0;

  ${(p) =>
    p.$hideOnMobile &&
    `
    @media (max-width: 480px) {
      display: none;
    }
  `}
`;

const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: ${(p) => p.$minWidth ?? 96}px;
  max-width: 100%;
  min-height: ${(p) => (p.$embedded ? '0' : `${p.$minHeight ?? 40}px`)};
  height: ${(p) => (p.$embedded ? '100%' : 'auto')};
  padding: 0 24px 0 10px;
  border-radius: ${(p) => (p.$square ? '0' : 'var(--border-radius-sm)')};
  border: 1px solid var(--border-color);
  background: var(--background-color2);
  color: var(--text-color);
  font-family: var(--ui-font-family);
  font-size: 14px;
  font-weight: ${(p) => (p.$bold ? 700 : 'inherit')};
  cursor: pointer;
  transition: border-color 0.2s ease;
  text-align: left;
  box-sizing: border-box;

  &:hover {
    border-color: var(--accent-color);
  }

  &:focus {
    outline: none;
    border-color: var(--accent-color);
  }

  ${(p) =>
    p.$attached &&
    !p.$embedded &&
    `
    border: none;
    border-radius: ${p.$square ? '0' : p.$hasTrailing ? '0' : '0 var(--border-radius-sm) var(--border-radius-sm) 0'};

    &:hover,
    &:focus {
      border-color: transparent;
    }
  `}

  ${(p) =>
    p.$embedded &&
    `
    border: none;
    border-radius: ${p.$square ? '0' : p.$hasTrailing ? '0' : '0 var(--border-radius-sm) var(--border-radius-sm) 0'};

    &:hover,
    &:focus {
      border-color: transparent;
    }
  `}

  ${(p) =>
    p.$retro &&
    !p.$attached &&
    retroGlassButtonStyles}

  @media (max-width: 480px) {
    min-width: ${(p) => p.$minWidthMobile ?? p.$minWidth ?? 96}px;
    padding: 0 22px 0 8px;
  }
`;

const TriggerText = styled.span`
  flex: 1;
  min-width: 0;
  line-height: 1.1;
  white-space: nowrap;
`;

const OptionLine = DropdownOptionLine;

const SelectChevron = styled(ChevronDown)`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%) ${(p) => (p.$openUpward ? 'rotate(180deg)' : '')};
  width: 14px;
  height: 14px;
  color: var(--text-color-secondary);
  pointer-events: none;
`;

const menuSurfaceStyles = css`
  min-width: 100%;
  width: max-content;
  max-width: calc(100vw - 32px);
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--dropdown-bg);
  backdrop-filter: blur(12px);
  border: ${(p) => (p.$retro ? 'var(--retro-border-width)' : '1px')} solid
    ${(p) => (p.$retro ? 'color-mix(in srgb, var(--border-color) 85%, transparent)' : 'var(--border-color)')};
  border-radius: ${(p) => (p.$square ? '0' : 'var(--border-radius-sm)')};
  box-shadow: ${(p) => (p.$retro ? 'var(--retro-shadow)' : 'var(--panel-shadow)')};
  padding: 4px;
  ${thinScrollbarStyles}
`;

const Menu = styled.div`
  position: absolute;
  ${(p) =>
    p.$menuAlign === 'left'
      ? `
    left: 0;
    transform: none;
  `
      : `
    left: 50%;
    transform: translateX(-50%);
  `}
  max-height: ${MENU_MAX_HEIGHT}px;
  z-index: 1100;
  ${menuSurfaceStyles}

  ${(p) =>
    p.$openUpward
      ? `
    bottom: calc(100% + ${MENU_GAP}px);
    top: auto;
  `
      : `
    top: calc(100% + ${MENU_GAP}px);
    bottom: auto;
  `}
`;

const PortaledMenu = styled.div`
  position: fixed;
  z-index: ${MENU_PORTAL_Z_INDEX};
  ${menuSurfaceStyles}
`;

const Option = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 40px;
  padding: 10px 12px;
  text-align: left;
  background: none;
  border: none;
  border-radius: ${(p) => (p.$square ? '0' : 'var(--border-radius-xs)')};
  cursor: pointer;
  transition: background 0.2s;
  font-family: var(--ui-font-family);
  color: var(--text-color);
  box-sizing: border-box;

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

function computeMenuPlacement(triggerRect, optionCount, openUpwardPref, menuAlign) {
  const estimatedHeight = Math.min(optionCount * MENU_ROW_HEIGHT + 8, MENU_MAX_HEIGHT);
  const spaceBelow = window.innerHeight - triggerRect.bottom - MENU_GAP;
  const spaceAbove = triggerRect.top - MENU_GAP;

  let openUpward = openUpwardPref === true;
  if (openUpwardPref === 'auto') {
    openUpward = spaceBelow < estimatedHeight && spaceAbove > spaceBelow;
  }

  const maxHeight = Math.min(
    MENU_MAX_HEIGHT,
    Math.max(openUpward ? spaceAbove : spaceBelow, 120),
  );

  const style = {
    minWidth: triggerRect.width,
    maxHeight,
  };

  if (menuAlign === 'left') {
    style.left = triggerRect.left;
    style.transform = 'none';
  } else {
    style.left = triggerRect.left + triggerRect.width / 2;
    style.transform = 'translateX(-50%)';
  }

  if (openUpward) {
    style.bottom = window.innerHeight - triggerRect.top + MENU_GAP;
    style.top = 'auto';
  } else {
    style.top = triggerRect.bottom + MENU_GAP;
    style.bottom = 'auto';
  }

  return { openUpward, style };
}

/**
 * Custom select dropdown styled like the catalog page picker.
 */
function SelectDropdown({
  options,
  value,
  onChange,
  ariaLabel,
  menuAriaLabel,
  openUpward = false,
  menuAlign = 'center',
  menuPortal = false,
  triggerMinWidth = 96,
  triggerMinHeight = 40,
  triggerBold = false,
  attachedLabel,
  hideAttachedLabelOnMobile = false,
  embedded = false,
  square = false,
  retro = false,
  hasTrailing = false,
  triggerMinWidthMobile,
  renderOption,
  renderValue,
}) {
  const [open, setOpen] = useState(false);
  const [menuPlacement, setMenuPlacement] = useState({ openUpward: false, style: {} });
  const ref = useRef(null);
  const menuRef = useRef(null);
  const selected = options.find((opt) => opt.value === value) ?? options[0];
  const attached = Boolean(attachedLabel);
  const grouped = attached || embedded;

  const updateMenuPlacement = useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMenuPlacement(computeMenuPlacement(rect, options.length, openUpward, menuAlign));
  }, [menuAlign, openUpward, options.length]);

  useLayoutEffect(() => {
    if (!open || !menuPortal) return undefined;

    updateMenuPlacement();

    const handleReposition = () => updateMenuPlacement();
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [open, menuPortal, updateMenuPlacement]);

  const handleToggle = () => {
    if (!open && menuPortal && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setMenuPlacement(computeMenuPlacement(rect, options.length, openUpward, menuAlign));
    }
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return undefined;
    const handleClickOutside = (e) => {
      if (ref.current?.contains(e.target) || menuRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const renderLabel = (opt) => {
    if (renderOption) return renderOption(opt);
    return <OptionLine>{opt.label}</OptionLine>;
  };

  const triggerLabel = renderValue ? renderValue(selected) : renderLabel(selected);
  const resolvedOpenUpward = menuPortal ? menuPlacement.openUpward : openUpward === true;

  const menuContent = (
    <>
      {options.map((opt) => (
        <Option
          key={opt.value}
          type="button"
          role="option"
          aria-selected={opt.value === value}
          $active={opt.value === value}
          $square={square}
          onClick={() => {
            onChange(opt.value);
            setOpen(false);
          }}
        >
          {renderLabel(opt)}
        </Option>
      ))}
    </>
  );

  const menu = menuPortal ? (
    <PortaledMenu
      ref={menuRef}
      role="listbox"
      aria-label={menuAriaLabel ?? ariaLabel}
      $square={square}
      $retro={retro}
      style={menuPlacement.style}
    >
      {menuContent}
    </PortaledMenu>
  ) : (
    <Menu
      ref={menuRef}
      role="listbox"
      aria-label={menuAriaLabel ?? ariaLabel}
      $openUpward={resolvedOpenUpward}
      $menuAlign={menuAlign}
      $square={square}
      $retro={retro}
    >
      {menuContent}
    </Menu>
  );

  return (
    <SelectWrapper
      ref={ref}
      $open={open}
      $attached={attached}
      $embedded={embedded}
      $square={square}
      $retro={retro}
      $menuPortal={menuPortal}
    >
      {attachedLabel && (
        <AttachedLabel $hideOnMobile={hideAttachedLabelOnMobile} $square={square}>
          {attachedLabel}
        </AttachedLabel>
      )}
      <Trigger
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        $minWidth={triggerMinWidth}
        $minWidthMobile={triggerMinWidthMobile}
        $minHeight={triggerMinHeight}
        $bold={triggerBold}
        $attached={grouped}
        $embedded={embedded}
        $square={square}
        $retro={retro}
        $hasTrailing={hasTrailing}
      >
        <TriggerText>{triggerLabel}</TriggerText>
        <SelectChevron size={14} aria-hidden="true" $openUpward={open && resolvedOpenUpward} />
      </Trigger>
      {open && (menuPortal ? createPortal(menu, document.body) : menu)}
    </SelectWrapper>
  );
}

export default SelectDropdown;
