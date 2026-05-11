import { useSearchParams, Navigate } from 'react-router-dom';
import Content from '../components/home/Content';
import Footer from '../components/home/Footer';
import Header from '../components/home/Header';
import HomeTopBar from '../components/home/HomeTopBar';
import { useConversionMode } from '../hooks/useConversionMode';
import { buildCatalogUrl } from '../utils/navigation';

function Home() {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get('bookId');
  const [conversionMode, setConversionMode] = useConversionMode();

  if (bookId) {
    return <Navigate to={buildCatalogUrl(bookId)} replace />;
  }

  return (
    <>
      <HomeTopBar conversionMode={conversionMode} onConversionModeChange={setConversionMode} />
      <Header />
      <Content conversionMode={conversionMode} />
      <Footer />
    </>
  );
}

export default Home;
