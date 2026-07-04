import styled from 'styled-components';
import packageJson from '../../../package.json';

const FooterWrapper = styled.footer`
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
  text-align: center;
  margin-top: 70px;
  padding: 32px 24px calc(26px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)));
  color: var(--text-color-secondary);
  font-size: 13px;
  letter-spacing: 0.06em;
  font-family: var(--display-font-family);
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 24px;
    right: 24px;
    border-top: var(--retro-border-width) dashed var(--border-color);
    mask-image: linear-gradient(
      to right,
      #000 0,
      #000 calc(50% - 22px),
      transparent calc(50% - 22px),
      transparent calc(50% + 22px),
      #000 calc(50% + 22px),
      #000 100%
    );
    -webkit-mask-image: linear-gradient(
      to right,
      #000 0,
      #000 calc(50% - 22px),
      transparent calc(50% - 22px),
      transparent calc(50% + 22px),
      #000 calc(50% + 22px),
      #000 100%
    );
  }

  &::before {
    content: '♡';
    position: absolute;
    top: -11px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
    color: var(--accent-color);
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
