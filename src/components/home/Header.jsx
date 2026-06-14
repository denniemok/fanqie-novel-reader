import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: calc(80px + env(safe-area-inset-top));
  margin-bottom: 24px;
  gap: 16px;

  @media (max-width: 400px) {
    padding-top: calc(30px + env(safe-area-inset-top));
  }
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 900;
  margin: 0 0 10px;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 3px 3px 0px var(--background-color);
  border: var(--retro-border-width) solid var(--border-color);
  padding: 6px 30px;
  background-color: var(--background-color2);
  box-shadow: var(--retro-shadow);
  max-width: calc(100vw - 32px);
  box-sizing: border-box;
  text-align: center;

  @media (max-width: 400px) {
    font-size: 28px;
    padding: 6px 24px;
    letter-spacing: 1px;
  }

  @media (max-width: 340px) {
    font-size: 24px;
    padding: 6px 16px;
  }
`;

function Header() {
  return (
    <HeaderWrapper>
      <Title>番茄繁體閱讀</Title>
    </HeaderWrapper>
  );
}

export default Header;
