import { useSearchParams, Navigate } from 'react-router-dom';
import NavPageLayout from '../components/common/NavPageLayout';
import NavTopBar from '../components/common/NavTopBar';
import Content from '../components/bookshelf/Content';
import { useConversionMode } from '../hooks/useConversionMode';
import { buildCatalogUrl } from '../utils/navigation';

function Bookshelf() {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get('bookId');
  const [conversionMode] = useConversionMode();

  if (bookId) {
    return <Navigate to={buildCatalogUrl(bookId)} replace />;
  }

  return (
    <NavPageLayout>
      <NavTopBar pageTitle="書架" />
      <Content conversionMode={conversionMode} />
    </NavPageLayout>
  );
}

export default Bookshelf;
