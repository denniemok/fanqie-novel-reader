import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { IconButton } from './IconButton';

export const NEW_BOOK_BUTTON_TITLE = '新增書籍';

function NewBookButton({ title = NEW_BOOK_BUTTON_TITLE }) {
  const navigate = useNavigate();
  return (
    <IconButton type="button" title={title} onClick={() => navigate('/new-book')}>
      <Plus size={20} strokeWidth={2.5} />
    </IconButton>
  );
}

export default NewBookButton;
