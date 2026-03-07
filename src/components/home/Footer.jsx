import styled from 'styled-components';

const FooterWrapper = styled.footer`
  text-align: center;
  padding: 24px 24px calc(24px + env(safe-area-inset-bottom));
  color: var(--text-color-secondary);
  font-size: 13px;
  max-width: 800px;
  margin: 0 auto;
  border-top: 1px solid var(--border-color);
`;

function Footer() {
  return <FooterWrapper>FQNR · 僅供學習交流使用</FooterWrapper>;
}

export default Footer;
