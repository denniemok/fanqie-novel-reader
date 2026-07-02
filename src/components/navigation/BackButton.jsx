import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { IconButton } from '../ui/IconButton';

export const BACK_BUTTON_TITLE = '返回';

function BackButton({ title = BACK_BUTTON_TITLE }) {
  const navigate = useNavigate();

  return (
    <IconButton type="button" title={title} aria-label={title} onClick={() => navigate(-1)}>
      <ArrowLeft size={20} strokeWidth={2.5} />
    </IconButton>
  );
}

export default BackButton;
