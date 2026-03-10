import { useNavigate } from 'react-router-dom';
import { List } from 'lucide-react';
import { IconButton } from './IconButton';
import { buildCatalogUrl } from '../../utils/navigation';

function CatalogButton({ bookId }) {
  const navigate = useNavigate();
  if (!bookId) return null;
  return (
    <IconButton type="button" title="目錄" onClick={() => navigate(buildCatalogUrl(bookId))}>
      <List size={20} strokeWidth={2.5} />
    </IconButton>
  );
}

export default CatalogButton;
