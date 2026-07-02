import { List, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookActionBar from '../common/BookActionBar';
import LabeledIconButton from '../common/LabeledIconButton';
import { buildCatalogUrl } from '../../utils/navigation';
import { CATALOG_BUTTON_TITLE } from '../common/CatalogButton';

function CommentsActionBar({ bookId, onRefresh }) {
  const navigate = useNavigate();

  return (
    <BookActionBar>
      <LabeledIconButton type="button" label="刷新評論" title="刷新評論" onClick={onRefresh}>
        <RefreshCw size={20} strokeWidth={2.5} />
      </LabeledIconButton>
      {bookId && (
        <LabeledIconButton
          type="button"
          label={CATALOG_BUTTON_TITLE}
          title={CATALOG_BUTTON_TITLE}
          onClick={() => navigate(buildCatalogUrl(bookId))}
        >
          <List size={20} strokeWidth={2.5} />
        </LabeledIconButton>
      )}
    </BookActionBar>
  );
}

export default CommentsActionBar;
