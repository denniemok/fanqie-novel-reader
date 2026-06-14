import { useSearchParams, Navigate } from 'react-router-dom';
import BookshelfTopBar from '../components/bookshelf/BookshelfTopBar';
import BookshelfContent from '../components/bookshelf/BookshelfContent';
import { useConversionMode } from '../hooks/useConversionMode';
import { buildCatalogUrl } from '../utils/navigation';

function Bookshelf() {
  const [searchParams] = useSearchParams();
  const bookId = searchParams.get('bookId');
  const [conversionMode, setConversionMode] = useConversionMode();

  if (bookId) {
    return <Navigate to={buildCatalogUrl(bookId)} replace />;
  }

  return (
    <>
      <BookshelfTopBar conversionMode={conversionMode} onConversionModeChange={setConversionMode} />
      <BookshelfContent conversionMode={conversionMode} />
    </>
  );
}

export default Bookshelf;
