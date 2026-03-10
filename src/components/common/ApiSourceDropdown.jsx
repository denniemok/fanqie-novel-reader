import { Globe } from 'lucide-react';
import IconDropdown from './IconDropdown';
import { useApiBase } from '../../hooks/useApiBase';
import { API_OPTIONS } from '../../utils/constants';

function ApiSourceDropdown() {
  const [apiBase, handleApiChange] = useApiBase();
  return (
    <IconDropdown
      icon={<Globe size={20} strokeWidth={2.5} />}
      title="API 來源"
      ariaLabel="選擇 API 來源"
      options={API_OPTIONS}
      value={apiBase}
      onChange={handleApiChange}
    />
  );
}

export default ApiSourceDropdown;
