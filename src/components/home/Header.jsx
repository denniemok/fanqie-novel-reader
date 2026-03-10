import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: calc(60px + env(safe-area-inset-top));
  margin-bottom: 20px;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 36px;
  font-weight: 900;
  margin: 0;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 3px 3px 0px var(--background-color);
  border: var(--retro-border-width) solid var(--border-color);
  padding: 6px 30px;
  background-color: var(--background-color2);
  box-shadow: var(--retro-shadow);

  @media (max-width: 480px) {
    font-size: 28px;
    padding: 6px 24px;
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
