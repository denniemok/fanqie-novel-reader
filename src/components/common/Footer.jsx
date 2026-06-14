import styled from 'styled-components';
import packageJson from '../../../package.json';

const FooterWrapper = styled.footer`
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
  text-align: center;
  margin-top: 40px;
  padding: 32px 24px calc(32px + env(safe-area-inset-bottom));
  color: var(--text-color-secondary);
  font-size: 13px;
  letter-spacing: 0.06em;
  border-top: var(--retro-border-width) dashed var(--border-color);
  font-family: var(--display-font-family);
  position: relative;

  &::before {
    content: '♡';
    position: absolute;
    top: -11px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    color: var(--accent-color);
    background: var(--background-color);
    padding: 0 12px;
    line-height: 1;
  }
`;

const Version = styled.span`
  color: var(--accent-color);
  opacity: 0.85;
`;

function Footer() {
  return (
    <FooterWrapper>
      FanqieTC · <Version>v{packageJson.version}</Version> · 僅供個人學習交流使用
    </FooterWrapper>
  );
}

export default Footer;
