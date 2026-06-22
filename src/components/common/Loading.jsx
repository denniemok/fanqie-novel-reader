import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { GrayButton } from './GrayButton';
import { viewportHeight } from '../../utils/styled/viewport';

const bounce = keyframes`
  0%, 80%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
  40% { transform: translateY(-10px) scale(1.15); opacity: 1; }
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${viewportHeight}
  gap: 16px;

  p {
    font-family: var(--display-font-family);
    font-size: 1.05rem;
    color: var(--text-color);
    letter-spacing: 0.08em;
  }

  .counter {
    font-size: 0.9rem;
    color: var(--text-color-secondary);
  }
`;

const DotsRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
`;

const Dot = styled.span`
  width: 14px;
  height: 14px;
  border-radius: 50% !important;
  background: var(--accent-color);
  animation: ${bounce} 1.2s ease-in-out infinite;
  animation-delay: ${(p) => p.$delay}s;
  box-shadow: 0 2px 6px rgba(160, 120, 130, 0.35);
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
        <Dot $delay={0.15} />
        <Dot $delay={0.3} />
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
