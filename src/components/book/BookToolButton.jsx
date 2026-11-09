import styled from 'styled-components';

/** Quiet secondary action shown beside a book's primary button; icon-only on phones. */
const Button = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sketch);
  background: transparent;
  color: ${(p) => (p.$active ? 'var(--accent-color)' : 'var(--text-color-secondary)')};
  font: inherit;
  font-size: 14px;
  letter-spacing: 0.06em;
  white-space: nowrap;
  cursor: pointer;
  transition: var(--transition-default);

  svg { width: 16px; height: 16px; flex-shrink: 0; }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: var(--hover-background-color);
      border-color: var(--border-strong);
      color: var(--accent-color);
    }
  }
  &:active:not(:disabled) { transform: scale(0.97); }
  &:disabled { cursor: not-allowed; opacity: 0.5; }

  @media (max-width: 480px) {
    width: 40px;
    padding: 0;
    .label { display: none; }
  }
`;

function BookToolButton({ icon: Icon, label, ...props }) {
  return (
    <Button type="button" title={label} aria-label={label} {...props}>
      <Icon aria-hidden />
      <span className="label">{label}</span>
    </Button>
  );
}

export default BookToolButton;
