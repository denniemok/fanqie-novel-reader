import styled from 'styled-components';
import SettingsButton from '../settings/SettingsButton';

const Header = styled.header`
  width: min(100%, 800px);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
  padding: calc(120px + env(safe-area-inset-top)) 24px 0;
  margin-bottom: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: fadeInUp 0.7s var(--ease-out) backwards;

  @media (max-width: 480px) {
    padding: calc(88px + env(safe-area-inset-top)) 16px 0;
    margin-bottom: 36px;
  }
`;

const Title = styled.h1`
  margin: 0;
  /* Offset trailing letter-spacing so the glyphs stay optically centred. */
  padding-left: 0.32em;
  font-family: var(--display-font-family);
  font-size: clamp(40px, 8vw, 60px);
  font-weight: 600;
  letter-spacing: 0.32em;
  line-height: 1.1;
  color: var(--text-color);
`;

const Subtitle = styled.p`
  margin: 20px 0 0;
  padding-left: 0.24em;
  color: var(--text-color-secondary);
  font-family: var(--display-font-family);
  font-size: 15px;
  letter-spacing: 0.24em;

  @media (max-width: 480px) {
    font-size: 14px;
    letter-spacing: 0.16em;
    padding-left: 0.16em;
  }
`;

const SettingsButtonSlot = styled.div`
  position: fixed;
  top: calc(12px + env(safe-area-inset-top));
  right: calc(24px + env(safe-area-inset-right));
  z-index: 99;

  @media (max-width: 480px) {
    top: calc(10px + env(safe-area-inset-top));
    right: calc(16px + env(safe-area-inset-right));
  }
`;

function HomeHeader() {
  return (
    <>
      <SettingsButtonSlot>
        <SettingsButton />
      </SettingsButtonSlot>
      <Header>
        <Title>番閱</Title>
        <Subtitle>留一段安靜時間，讀你想讀的故事。</Subtitle>
      </Header>
    </>
  );
}

export default HomeHeader;
