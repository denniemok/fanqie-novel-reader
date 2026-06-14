import { useSearchParams, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Content from '../components/home/Content';
import Footer from '../components/common/Footer';
import Header from '../components/home/Header';
import { buildCatalogUrl } from '../utils/navigation';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

function Home() {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get('bookId');

  if (bookId) {
    return <Navigate to={buildCatalogUrl(bookId)} replace />;
  }

  return (
    <Page>
      <Main>
        <Header />
        <Content />
      </Main>
      <Footer />
    </Page>
  );
}

export default Home;
