import { keyframes, css } from 'styled-components';

export const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const shimmerStyle = css`
  background: linear-gradient(
    90deg,
    var(--background-color2) 25%,
    var(--border-color) 50%,
    var(--background-color2) 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;
