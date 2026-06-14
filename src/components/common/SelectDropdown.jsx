import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import styled from 'styled-components';

const SelectWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: stretch;
  height: ${(p) => (p.$embedded ? '100%' : 'auto')};

  ${(p) =>
    p.$attached &&
    !p.$embedded &&
    `
    border: 1px solid var(--border-color);
    border-radius: 12px;
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
  border-radius: 12px 0 0 12px;
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
  border-radius: 12px;
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
    border-radius: ${p.$hasTrailing ? '0' : '0 12px 12px 0'};

    &:hover,
    &:focus {
      border-color: transparent;
    }
  `}

  ${(p) =>
    p.$embedded &&
    `
    border: none;
    border-radius: ${p.$hasTrailing ? '0' : '0 12px 12px 0'};

    &:hover,
    &:focus {
      border-color: transparent;
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
  background-color: rgba(18, 18, 18, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  z-index: 1100;
  padding: 8px;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;

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

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 999px;
  }

  @media (hover: hover) {
    &::-webkit-scrollbar-thumb:hover {
      background: var(--text-color-secondary);
    }
  }
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
  border-radius: 8px;
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
    background-color: var(--hover-background-color);
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
    <SelectWrapper ref={ref} $attached={attached} $embedded={embedded}>
      {attachedLabel && (
        <AttachedLabel $hideOnMobile={hideAttachedLabelOnMobile}>{attachedLabel}</AttachedLabel>
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
        >
          {options.map((opt) => (
            <Option
              key={opt.value}
              type="button"
              role="option"
              aria-selected={opt.value === value}
              $active={opt.value === value}
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
