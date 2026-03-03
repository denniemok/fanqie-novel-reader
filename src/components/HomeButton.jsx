import { Home } from 'lucide-react';
import { IconLink } from './IconButton';

function HomeButton() {
  return (
    <IconLink to="/" title="返回首頁">
      <Home size={20} strokeWidth={2.5} />
    </IconLink>
  );
}

export default HomeButton;
