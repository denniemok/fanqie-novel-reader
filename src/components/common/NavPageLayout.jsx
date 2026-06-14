import styled from 'styled-components';
import Footer from './Footer';
import { minViewportHeight } from '../../utils/styled/viewport';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  ${minViewportHeight}
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
