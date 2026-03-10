import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { IconButton } from './IconButton';

function HomeButton() {
  const navigate = useNavigate();
  return (
    <IconButton type="button" title="返回首頁" onClick={() => navigate('/')}>
      <Home size={20} strokeWidth={2.5} />
    </IconButton>
  );
}

export default HomeButton;
