import styled from 'styled-components';
import packageJson from '../../../package.json';

const FooterWrapper = styled.footer`
  width: min(100%, 800px);
  margin: 56px auto 0;
  flex-shrink: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  padding: 20px 24px calc(20px + var(--safe-area-bottom, env(safe-area-inset-bottom, 0px)));
  color: var(--text-color-secondary);
  font-size: 12px;
  letter-spacing: 0.14em;
  text-align: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 24px;
    right: 24px;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--border-strong) 20%, var(--border-strong) 80%, transparent);
  }
`;

const Version = styled.span`
  font-variant-numeric: tabular-nums;
  opacity: 0.8;
`;

function Footer() {
  return (
    <FooterWrapper>
      <span><Version>v{packageJson.version}</Version> · 僅供個人學習交流使用</span>
    </FooterWrapper>
  );
}

export default Footer;
