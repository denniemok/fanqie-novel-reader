import { Activity, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IconDropdown, { MenuFooterButton } from './IconDropdown';
import { useApiBase } from '../../hooks/useApiBase';
import { useApiStatus } from '../../hooks/useApiStatus';
import { API_OPTIONS } from '../../utils/constants';
import { ROUTES } from '../../utils/navigation';

export const API_DROPDOWN_TITLE = 'API 服務';
export const API_STATUS_MENU_LABEL = 'API 狀態';

function ApiDropdown({ title = API_DROPDOWN_TITLE, disabled = false }) {
  const navigate = useNavigate();
  const [apiBase, handleApiChange] = useApiBase();
  const statusByApi = useApiStatus();
  const options = API_OPTIONS.map((opt) => ({
    ...opt,
    status: statusByApi[opt.value],
  }));

  return (
    <IconDropdown
      icon={<Globe size={20} strokeWidth={2.5} />}
      title={title}
      ariaLabel="選擇 API 服務"
      options={options}
      value={apiBase}
      onChange={handleApiChange}
      disabled={disabled}
      footer={(close) => (
        <MenuFooterButton
          type="button"
          onClick={() => {
            close();
            navigate(ROUTES.status);
          }}
        >
          <Activity size={16} strokeWidth={2.5} aria-hidden />
          {API_STATUS_MENU_LABEL}
        </MenuFooterButton>
      )}
    />
  );
}

ApiDropdown.toolLabel = API_DROPDOWN_TITLE;

export default ApiDropdown;
