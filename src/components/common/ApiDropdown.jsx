import { Globe } from 'lucide-react';
import IconDropdown from './IconDropdown';
import { useApiBase } from '../../hooks/useApiBase';
import { API_OPTIONS } from '../../utils/constants';

export const API_DROPDOWN_TITLE = 'API 服務';

function ApiDropdown({ title = API_DROPDOWN_TITLE }) {
  const [apiBase, handleApiChange] = useApiBase();
  return (
    <IconDropdown
      icon={<Globe size={20} strokeWidth={2.5} />}
      title={title}
      ariaLabel="選擇 API 服務"
      options={API_OPTIONS}
      value={apiBase}
      onChange={handleApiChange}
    />
  );
}

export default ApiDropdown;
