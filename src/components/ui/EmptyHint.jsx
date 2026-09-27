import styled from 'styled-components';

const EmptyHint = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  font-size: 14px;
  letter-spacing: 0.04em;
  color: var(--text-color-secondary);
  text-align: center;
  padding: ${(p) => (p.$compact ? '36px' : '56px')} 20px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--surface-muted);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
`;

export default EmptyHint;
