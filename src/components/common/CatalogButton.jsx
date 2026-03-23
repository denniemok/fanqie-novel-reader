import { useNavigate } from 'react-router-dom';
import { List } from 'lucide-react';
import { IconButton } from './IconButton';
import { buildCatalogUrl } from '../../utils/navigation';

export const CATALOG_BUTTON_TITLE = '返回目錄';

function CatalogButton({ bookId, title = CATALOG_BUTTON_TITLE }) {
  const navigate = useNavigate();
  if (!bookId) return null;
  return (
    <IconButton type="button" title={title} onClick={() => navigate(buildCatalogUrl(bookId))}>
      <List size={20} strokeWidth={2.5} />
    </IconButton>
  );
}

export default CatalogButton;
