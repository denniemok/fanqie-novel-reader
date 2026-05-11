import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: calc(76px + 36px + env(safe-area-inset-top));
  margin-bottom: 20px;
  gap: 16px;

  @media (max-width: 480px) {
    padding-top: calc(68px + 28px + env(safe-area-inset-top));
  }
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
      <Title>閱讀番茄小說</Title>
    </HeaderWrapper>
  );
}

export default Header;
