import styled from 'styled-components';

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

/** Editorial section heading: serif label followed by a hairline rule. */
export const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  font-family: var(--display-font-family);
  letter-spacing: 0.12em;
  line-height: 1.4;
  color: var(--text-color);

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border-color);
  }
`;
