import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  height: 100vh;
  gap: 16px;
  background-color: var(--background-color);
  padding: 16px;
`;

const ErrorText = styled.p`
  font-size: 1rem;
  color: var(--text-color);
  text-align: center;
  word-break: break-word;
`;

const HomeButton = styled.button`
  margin-top: 8px;
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

function Error({ message, href = '/' }) {
  const navigate = useNavigate();
  return (
    <ErrorWrapper role="alert">
      <ErrorText dangerouslySetInnerHTML={{ __html: message }} />
      <HomeButton type="button" onClick={() => navigate(href)}>
        返回首頁
      </HomeButton>
    </ErrorWrapper>
  );
}

export default Error;
