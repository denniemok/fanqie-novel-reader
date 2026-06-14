import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { IconButton } from './IconButton';
import { ROUTES } from '../../utils/navigation';

export const NEW_BOOK_BUTTON_TITLE = '新增書籍';

function NewBookButton({ title = NEW_BOOK_BUTTON_TITLE, disabled: disabledProp }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const disabled = disabledProp ?? pathname === ROUTES.newBook;

  return (
    <IconButton
      type="button"
      title={title}
      disabled={disabled}
      onClick={() => navigate(ROUTES.newBook)}
    >
      <Plus size={20} strokeWidth={2.5} />
    </IconButton>
  );
}

NewBookButton.toolLabel = NEW_BOOK_BUTTON_TITLE;

export default NewBookButton;
