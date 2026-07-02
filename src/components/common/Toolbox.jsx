import React from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { ModalOverlay, ModalTitleBar, ModalBody } from './ModalBase';
import NavButtons, { NAV_BUTTON_COMPONENTS } from './NavButtons';

const ToolboxOverlay = styled(ModalOverlay)`
  display: block;
  padding: 0;
  z-index: 1200;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  pointer-events: ${(p) => (p.$visible ? 'auto' : 'none')};
  transition: opacity 0.2s ease;
`;

const Panel = styled.div`
  position: fixed;
  top: max(12px, env(safe-area-inset-top));
  right: 0;
  width: min(260px, 85vw);
  max-height: calc(100dvh - 24px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  background: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  border-right: none;
  border-radius: var(--border-radius) 0 0 var(--border-radius);
  box-shadow: var(--retro-shadow);
  z-index: 1201;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: translateX(${(p) => (p.$open ? '0' : '100%')});
  transition: transform 0.25s ease-out;
  pointer-events: ${(p) => (p.$open ? 'auto' : 'none')};
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 2px 4px;
  min-width: 0;
  width: 100%;

  @media (hover: hover) {
    &:has(button:hover:not(:disabled)) span:last-child {
      color: var(--accent-color);
    }
  }
`;

const Label = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: var(--text-color-secondary);
  text-align: center;
  line-height: 1.2;
  letter-spacing: 0.03em;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
`;

function getToolLabel(child) {
  if (!React.isValidElement(child)) return null;
  if (child.type?.toolLabel) return child.type.toolLabel;
  const { title, 'aria-label': ariaLabel } = child.props ?? {};
  if (typeof title === 'string' && title) return title;
  if (typeof ariaLabel === 'string' && ariaLabel) return ariaLabel;
  return null;
}

function flattenToolboxChildren(children) {
  const items = [];

  React.Children.forEach(children, (child) => {
    if (!child) return;

    if (child.type === React.Fragment) {
      flattenToolboxChildren(child.props.children).forEach((item) => items.push(item));
      return;
    }

    if (child.type === NavButtons) {
      NAV_BUTTON_COMPONENTS.forEach((Btn, index) => {
        items.push(<Btn key={Btn.toolLabel ?? `nav-${index}`} />);
      });
      return;
    }

    items.push(child);
  });

  return items;
}

function Toolbox({ open, onClose, children }) {
  const toolboxItems = flattenToolboxChildren(children);

  return createPortal(
    <>
      <ToolboxOverlay $visible={open} onClick={onClose} aria-hidden={!open} />
      <Panel $open={open} role="dialog" aria-modal="true" aria-label="工具">
        <ModalTitleBar title="工具" onClose={onClose} />
        <ModalBody $scroll={false}>
          <Content>
            {toolboxItems.map((child, index) => {
              if (!child) return null;
              const label = getToolLabel(child);
              return (
                <Item key={child.key ?? index}>
                  {child}
                  {label && <Label>{label}</Label>}
                </Item>
              );
            })}
          </Content>
        </ModalBody>
      </Panel>
    </>,
    document.body,
  );
}

export default Toolbox;
