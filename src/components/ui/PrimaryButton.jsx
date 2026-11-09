import styled from 'styled-components';

/** The one accent-filled button per area: the main thing the user came to do. */
export const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border: 1px solid var(--accent-color);
  border-radius: var(--border-radius-sketch);
  color: var(--text-on-accent);
  background: var(--accent-color);
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.1em;
  white-space: nowrap;
  cursor: pointer;
  transition: var(--transition-default);

  svg { width: 16px; height: 16px; flex-shrink: 0; transition: transform 0.25s var(--ease-out); }

  @media (hover: hover) {
    &:hover { background: var(--accent-hover); border-color: var(--accent-hover); }
    &:hover svg { transform: translateX(3px); }
  }
  &:active { transform: scale(0.98); }
`;
