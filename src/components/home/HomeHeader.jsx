import React from 'react';
import styled, { keyframes } from 'styled-components';
import SettingsButton from '../settings/SettingsButton';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HeaderWrapper = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: calc(72px + env(safe-area-inset-top));
  margin-bottom: 28px;
  gap: 14px;
  animation: ${fadeIn} 0.6s cubic-bezier(0.34, 1.4, 0.64, 1) backwards;

  @media (max-width: 400px) {
    padding-top: calc(28px + env(safe-area-inset-top));
  }
`;

const SettingsButtonSlot = styled.div`
  position: fixed;
  top: calc(12px + env(safe-area-inset-top));
  right: calc(16px + env(safe-area-inset-right));
  z-index: 99;
`;

const Title = styled.h1`
  position: relative;
  font-family: var(--display-font-family);
  font-size: clamp(26px, 7vw, 38px);
  font-weight: 700;
  margin: 0;
  color: var(--accent-color);
  letter-spacing: 0.08em;
  border: var(--retro-border-width) dashed var(--border-color);
  border-radius: var(--border-radius-sketch);
  padding: 12px 40px;
  background: var(--card-surface);
  box-shadow: var(--retro-shadow);
  max-width: calc(100vw - 32px);
  box-sizing: border-box;
  text-align: center;
  animation: gentleFloat 5s ease-in-out infinite;

  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 44px;
    height: 16px;
    background: color-mix(in srgb, var(--accent-soft) 80%, var(--accent-color));
    opacity: 0.55;
    border-radius: 2px;
    top: -8px;
  }

  &::before {
    left: 18%;
    transform: rotate(-8deg);
  }

  &::after {
    right: 16%;
    transform: rotate(6deg);
    background: color-mix(in srgb, var(--accent-soft) 70%, var(--border-color));
  }

  @media (max-width: 400px) {
    padding: 10px 28px;
  }
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: var(--text-color-secondary);
  letter-spacing: 0.14em;
  display: flex;
  align-items: center;
  gap: 10px;

  &::before,
  &::after {
    content: '✦';
    font-size: 9px;
    color: var(--accent-color);
    opacity: 0.45;
  }
`;

function HomeHeader() {
  return (
    <HeaderWrapper>
      <SettingsButtonSlot>
        <SettingsButton />
      </SettingsButtonSlot>
      <Title>番茄閱讀</Title>
      <Subtitle>輕鬆閱讀每一天</Subtitle>
    </HeaderWrapper>
  );
}

export default HomeHeader;
