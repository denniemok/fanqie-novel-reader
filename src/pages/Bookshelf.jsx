import { useSearchParams, Navigate } from 'react-router-dom';
import NavPageLayout from '../components/layout/NavPageLayout';
import NavTopBar from '../components/layout/NavTopBar';
import BookshelfContent from '../components/bookshelf/BookshelfContent';
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
      <BookshelfContent conversionMode={conversionMode} />
    </NavPageLayout>
  );
}

export default Bookshelf;
