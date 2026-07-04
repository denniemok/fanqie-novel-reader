import styled from 'styled-components';

const ErrorNote = styled.p`
  margin: 0;
  padding: 8px 10px;
  font-size: 11px;
  line-height: 1.4;
  color: var(--accent-color);
  background: color-mix(in srgb, var(--accent-color) 10%, var(--background-color2));
  border-top: 1px dashed color-mix(in srgb, var(--accent-color) 35%, var(--border-color));
`;

function BookRefreshError({ message }) {
  if (!message) return null;
  return <ErrorNote role="alert">{message}</ErrorNote>;
}

export default BookRefreshError;
