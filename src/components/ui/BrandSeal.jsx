import styled from 'styled-components';

/** Square vermilion seal (印章) used as the brand mark. Size via $size (px). */
const BrandSeal = styled.span`
  --seal-size: ${(p) => p.$size ?? 22}px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: var(--seal-size);
  height: var(--seal-size);
  border-radius: calc(var(--seal-size) * 0.22);
  background: var(--accent-color);
  color: var(--text-on-accent);
  font-family: var(--display-font-family);
  font-size: calc(var(--seal-size) * 0.6);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  user-select: none;
`;

export default BrandSeal;
