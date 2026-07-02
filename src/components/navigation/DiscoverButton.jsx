import { useNavigate, useLocation } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { buildDefaultDiscoverUrl, isDiscoverPath } from '../../utils/navigation';

export const DISCOVER_BUTTON_TITLE = '新增書籍';

function DiscoverButton({ title = DISCOVER_BUTTON_TITLE, disabled: disabledProp }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const disabled = disabledProp ?? isDiscoverPath(pathname);

  return (
    <IconButton
      type="button"
      title={title}
      disabled={disabled}
      onClick={() => navigate(buildDefaultDiscoverUrl())}
    >
      <Compass size={20} strokeWidth={2.5} />
    </IconButton>
  );
}

DiscoverButton.toolLabel = '新書';

export default DiscoverButton;
