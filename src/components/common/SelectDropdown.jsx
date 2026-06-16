import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styled, { css } from 'styled-components';

const menuScrollStyles = css`
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 0;
  }

  @media (hover: hover) {
    &::-webkit-scrollbar-thumb:hover {
      background: var(--accent-color);
    }
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: stretch;
  height: ${(p) => (p.$embedded ? '100%' : 'auto')};
  ${(p) => p.$open && 'z-index: 50;'}

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
  font-family: inherit;
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
    css`
      border: var(--retro-border-width) solid color-mix(in srgb, var(--border-color) 85%, transparent);
      background: color-mix(in srgb, var(--background-color2) 48%, transparent);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      box-shadow: var(--retro-shadow);
      transition: all 0.1s steps(2);

      &:hover,
      &:focus {
        border-color: var(--accent-color);
        transform: translate(-1px, -1px);
        box-shadow: var(--retro-shadow-hover);
      }

      &:active {
        transform: translate(1px, 1px);
        box-shadow: var(--retro-shadow);
      }
    `}

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

const OptionLine = styled.span`
  display: block;
  font-size: 14px;
  line-height: 1.2;
  color: var(--text-color);
  white-space: nowrap;
`;

const SelectChevron = styled(ChevronDown)`
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: var(--text-color-secondary);
  pointer-events: none;
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
  min-width: 100%;
  width: max-content;
  max-width: calc(100vw - 32px);
  max-height: 280px;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: var(--dropdown-bg);
  backdrop-filter: blur(12px);
  border: ${(p) => (p.$retro ? 'var(--retro-border-width)' : '1px')} solid
    ${(p) => (p.$retro ? 'color-mix(in srgb, var(--border-color) 85%, transparent)' : 'var(--border-color)')};
  border-radius: ${(p) => (p.$square ? '0' : 'var(--border-radius-sm)')};
  box-shadow: ${(p) => (p.$retro ? 'var(--retro-shadow)' : 'var(--panel-shadow)')};
  z-index: 1100;
  padding: 4px;
  ${menuScrollStyles}

  ${(p) =>
    p.$openUpward
      ? `
    bottom: calc(100% + 8px);
    top: auto;
  `
      : `
    top: calc(100% + 8px);
    bottom: auto;
  `}
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
  font-family: inherit;
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
  const ref = useRef(null);
  const selected = options.find((opt) => opt.value === value) ?? options[0];
  const attached = Boolean(attachedLabel);
  const grouped = attached || embedded;

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const renderLabel = (opt) => {
    if (renderOption) return renderOption(opt);
    return <OptionLine>{opt.label}</OptionLine>;
  };

  const triggerLabel = renderValue ? renderValue(selected) : renderLabel(selected);

  return (
    <SelectWrapper ref={ref} $open={open} $attached={attached} $embedded={embedded} $square={square} $retro={retro}>
      {attachedLabel && (
        <AttachedLabel $hideOnMobile={hideAttachedLabelOnMobile} $square={square}>
          {attachedLabel}
        </AttachedLabel>
      )}
      <Trigger
        type="button"
        onClick={() => setOpen(!open)}
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
        <SelectChevron size={14} aria-hidden="true" />
      </Trigger>
      {open && (
        <Menu
          role="listbox"
          aria-label={menuAriaLabel ?? ariaLabel}
          $openUpward={openUpward}
          $menuAlign={menuAlign}
          $square={square}
          $retro={retro}
        >
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
        </Menu>
      )}
    </SelectWrapper>
  );
}

export default SelectDropdown;
