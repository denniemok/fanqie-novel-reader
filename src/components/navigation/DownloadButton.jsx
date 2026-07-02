import { useNavigate, useLocation } from 'react-router-dom';
import { Download } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { ROUTES } from '../../utils/navigation';

export const DOWNLOAD_BUTTON_TITLE = '前往下載';

function DownloadButton({ title = DOWNLOAD_BUTTON_TITLE, disabled: disabledProp }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const disabled = disabledProp ?? pathname === ROUTES.download;

  return (
    <IconButton
      type="button"
      title={title}
      disabled={disabled}
      onClick={() => navigate(ROUTES.download)}
    >
      <Download size={20} strokeWidth={2.5} />
    </IconButton>
  );
}

DownloadButton.toolLabel = '下載';

export default DownloadButton;
