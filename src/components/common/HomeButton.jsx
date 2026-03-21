import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { IconButton } from './IconButton';

export const HOME_BUTTON_TITLE = '返回首頁';

function HomeButton({ title = HOME_BUTTON_TITLE }) {
  const navigate = useNavigate();
  return (
    <IconButton type="button" title={title} onClick={() => navigate('/')}>
      <Home size={20} strokeWidth={2.5} />
    </IconButton>
  );
}

export default HomeButton;
