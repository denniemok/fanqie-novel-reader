import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { IconButton } from './IconButton';

export const BOOKSHELF_BUTTON_TITLE = '前往書架';

function BookshelfButton({ title = BOOKSHELF_BUTTON_TITLE }) {
  const navigate = useNavigate();
  return (
    <IconButton type="button" title={title} onClick={() => navigate('/bookshelf')}>
      <BookOpen size={20} strokeWidth={2.5} />
    </IconButton>
  );
}

export default BookshelfButton;
