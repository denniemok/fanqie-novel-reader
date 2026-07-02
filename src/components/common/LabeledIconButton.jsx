import styled from 'styled-components';
import { IconButton } from './IconButton';

export const ToolItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 2px 4px;

  @media (hover: hover) {
    &:has(button:hover:not(:disabled)) span:last-child {
      color: var(--accent-color);
    }
  }
`;

export const ToolLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: var(--text-color-secondary);
  text-align: center;
  line-height: 1.2;
  letter-spacing: 0.03em;
  max-width: 68px;
  transition: color 0.2s ease;
`;

function LabeledIconButton({ label, children, ...props }) {
  return (
    <ToolItem>
      <IconButton $variant="glass" {...props}>{children}</IconButton>
      {label ? <ToolLabel>{label}</ToolLabel> : null}
    </ToolItem>
  );
}

export default LabeledIconButton;
