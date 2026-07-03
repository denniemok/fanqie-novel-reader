import { useSearchParams, Navigate } from 'react-router-dom';
import NavPageLayout from '../components/layout/NavPageLayout';
import PageContent from '../components/layout/PageContent';
import HomeHeader from '../components/home/HomeHeader';
import NavGrid from '../components/home/NavGrid';
import MigrationNotice from '../components/home/MigrationNotice';
import PinnedNotice from '../components/home/PinnedNotice';
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
      <PageContent $variant="home" $paddingBottom={24} $paddingBottomMobile={20}>
        <MigrationNotice />
        <PinnedNotice />
        <NavGrid />
      </PageContent>
    </NavPageLayout>
  );
}

export default Home;
