import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const dots = keyframes`
  0%, 20% { color: rgba(0,0,0,0); text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0); }
  40% { color: var(--text-color); text-shadow: .25em 0 0 rgba(0,0,0,0), .5em 0 0 rgba(0,0,0,0); }
  60% { text-shadow: .25em 0 0 var(--text-color), .5em 0 0 rgba(0,0,0,0); }
  80%, 100% { text-shadow: .25em 0 0 var(--text-color), .5em 0 0 var(--text-color); }
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  height: 100vh;
  gap: 10px;

  p {
    font-size: 1rem;
    color: var(--text-color);

    &::after {
      content: '.';
      animation: ${dots} 1s steps(5, end) infinite;
    }
  }

  .counter {
    &::after {
      content: none;
      animation: none;
    }
  }
`;

const Spinner = styled.div`
  border: 4px solid rgba(255, 115, 0, 0.3);
  border-top: 4px solid var(--high-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`;

const AbortButton = styled.button`
  margin-top: 16px;
  padding: 10px 20px;
  font-size: 0.9rem;
  color: var(--text-color-secondary);
  background: var(--background-color2);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: var(--accent-color);
    border-color: var(--accent-color);
  }
`;

function LoadingPage({ onAbort }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <LoadingWrapper>
      <Spinner />
      <p>載入中</p>
      <p className="counter">{seconds} 秒</p>
      {onAbort && (
        <AbortButton type="button" onClick={onAbort}>
          取消載入
        </AbortButton>
      )}
    </LoadingWrapper>
  );
}

export default LoadingPage;
