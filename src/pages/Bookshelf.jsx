import { useSearchParams, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import BookshelfTopBar from '../components/bookshelf/BookshelfTopBar';
import BookshelfContent from '../components/bookshelf/BookshelfContent';
import Footer from '../components/common/Footer';
import { useConversionMode } from '../hooks/useConversionMode';
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

function Bookshelf() {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get('bookId');
  const [conversionMode, setConversionMode] = useConversionMode();

  if (bookId) {
    return <Navigate to={buildCatalogUrl(bookId)} replace />;
  }

  return (
    <Page>
      <Main>
        <BookshelfTopBar conversionMode={conversionMode} onConversionModeChange={setConversionMode} />
        <BookshelfContent conversionMode={conversionMode} />
      </Main>
      <Footer />
    </Page>
  );
}

export default Bookshelf;
