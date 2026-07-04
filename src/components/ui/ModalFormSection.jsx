import styled from 'styled-components';

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;

  & + & {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border-color);
  }

  @media (max-height: 500px) {
    gap: 6px;

    & + & {
      margin-top: 12px;
      padding-top: 12px;
    }
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-color-secondary);

  svg {
    color: var(--accent-color);
    flex-shrink: 0;
  }
`;

export const SelectField = styled.div`
  width: 100%;

  > div {
    display: flex;
    width: 100%;
  }

  button {
    flex: 1;
    min-width: 0 !important;
    width: 100%;
  }
`;

export const MODAL_SELECT_PROPS = {
  menuAlign: 'left',
  menuPortal: true,
  openUpward: 'auto',
  triggerMinWidth: 0,
};
