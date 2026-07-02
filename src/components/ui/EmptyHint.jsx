import styled from 'styled-components';

const EmptyHint = styled.div`
  font-size: 13px;
  color: var(--text-color-secondary);
  opacity: 0.6;
  text-align: center;
  padding: ${(p) => (p.$compact ? '32px' : '40px')} 16px;
  border: 1px dashed var(--border-color);
  background: var(--background-color2);
`;

export default EmptyHint;
