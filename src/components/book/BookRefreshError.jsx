import styled from 'styled-components';

const ErrorNote = styled.p`
  margin: 0;
  padding: 8px 12px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--toast-error-color);
  background: color-mix(in srgb, var(--toast-error-color) 8%, transparent);
  border-top: 1px solid var(--border-color);
`;

function BookRefreshError({ message }) {
  if (!message) return null;
  return <ErrorNote role="alert">{message}</ErrorNote>;
}

export default BookRefreshError;
