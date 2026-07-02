import styled from 'styled-components';
import { IconButton } from './IconButton';

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 2px 4px;
  flex-shrink: 0;

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
  max-width: 72px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
`;

function LabeledIconButton({ label, children, ...props }) {
  return (
    <Item>
      <IconButton $variant="glass" {...props}>{children}</IconButton>
      {label ? <Label>{label}</Label> : null}
    </Item>
  );
}

export default LabeledIconButton;
