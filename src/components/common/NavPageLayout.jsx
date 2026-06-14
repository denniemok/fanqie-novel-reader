import styled from 'styled-components';
import Footer from './Footer';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;

  @supports (-webkit-touch-callout: none) {
    min-height: -webkit-fill-available;
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

function NavPageLayout({ children }) {
  return (
    <Page>
      <Main>{children}</Main>
      <Footer />
    </Page>
  );
}

export default NavPageLayout;
