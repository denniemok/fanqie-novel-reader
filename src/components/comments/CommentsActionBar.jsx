import { List, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookToolButton from '../book/BookToolButton';
import { buildCatalogUrl } from '../../utils/navigation';
import { CATALOG_BUTTON_TITLE } from '../navigation/CatalogButton';

/** Comment-page tools; rendered inside BookInfo's action row. */
function CommentsActionBar({ bookId, onRefresh }) {
  const navigate = useNavigate();

  return (
    <>
      <BookToolButton icon={RefreshCw} label="刷新評論" onClick={onRefresh} />
      {bookId && (
        <BookToolButton
          icon={List}
          label={CATALOG_BUTTON_TITLE}
          onClick={() => navigate(buildCatalogUrl(bookId))}
        />
      )}
    </>
  );
}

export default CommentsActionBar;
