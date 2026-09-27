import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { GrayButton } from './GrayButton';
import { viewportHeight } from '../../utils/styled/viewport';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

/* Slow, soft breathing so the dots feel calm rather than blinking. */
const pulse = keyframes`
  0%, 100% { transform: scale(0.75); opacity: 0.25; }
  50% { transform: scale(1); opacity: 0.85; }
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${viewportHeight}
  gap: 16px;
  /* Hold back briefly so fast (cached) loads never flash the indicator. */
  animation: ${fadeIn} 0.5s ease 0.3s backwards;

  p {
    margin: 0;
    font-family: var(--display-font-family);
    font-size: 1rem;
    color: var(--text-color);
    letter-spacing: 0.2em;
  }

  .counter {
    font-family: var(--ui-font-family);
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    color: var(--text-color-secondary);
    font-variant-numeric: tabular-nums;
  }
`;

const DotsRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 4px;
  justify-content: center;
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent-color);
  animation: ${pulse} 1.5s ease-in-out ${(p) => p.$delay}s infinite both;
`;

const AbortButton = styled(GrayButton)`
  margin-top: 8px;
`;

function Loading({ onAbort }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <LoadingWrapper>
      <DotsRow>
        <Dot $delay={0} />
        <Dot $delay={0.25} />
        <Dot $delay={0.5} />
      </DotsRow>
      <p>載入中…</p>
      <p className="counter">{seconds} 秒</p>
      {onAbort && (
        <AbortButton type="button" onClick={onAbort}>
          取消載入
        </AbortButton>
      )}
    </LoadingWrapper>
  );
}

export default Loading;
