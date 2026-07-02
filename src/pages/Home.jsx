import { useSearchParams, Navigate } from 'react-router-dom';
import NavPageLayout from '../components/layout/NavPageLayout';
import HomeContent from '../components/home/HomeContent';
import HomeHeader from '../components/home/HomeHeader';
import { buildCatalogUrl } from '../utils/navigation';

function Home() {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get('bookId');

  if (bookId) {
    return <Navigate to={buildCatalogUrl(bookId)} replace />;
  }

  return (
    <NavPageLayout>
      <HomeHeader />
      <HomeContent />
    </NavPageLayout>
  );
}

export default Home;
