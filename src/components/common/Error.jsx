import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { GrayButton } from './GrayButton';

const ErrorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  height: 100dvh;

  @supports (-webkit-touch-callout: none) {
    height: -webkit-fill-available;
  }
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

const StyledHomeButton = styled(GrayButton)`
  margin-top: 8px;
`;

function getBackLabel(href) {
  if (href === '/') return '返回首頁';
  if (/^\/catalog\/.+/.test(href)) return '返回目錄';
  return '返回';
}

function Error({ message, href = '/' }) {
  const navigate = useNavigate();
  return (
    <ErrorWrapper role="alert">
      <ErrorText>{message}</ErrorText>
      <StyledHomeButton type="button" onClick={() => navigate(href)}>
        {getBackLabel(href)}
      </StyledHomeButton>
    </ErrorWrapper>
  );
}

export default Error;
