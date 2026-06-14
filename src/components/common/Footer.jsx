import styled from 'styled-components';

const FooterWrapper = styled.footer`
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
  text-align: center;
  margin-top: 32px;
  padding: 28px 24px calc(28px + env(safe-area-inset-bottom));
  color: var(--text-color-secondary);
  font-size: 13px;
  border-top: var(--retro-border-width) solid var(--border-color);
  font-family: inherit;
`;

function Footer() {
  return (
    <FooterWrapper>
      FanqieTC · 僅供個人學習交流使用
    </FooterWrapper>
  );
}

export default Footer;
