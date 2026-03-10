import { Languages } from 'lucide-react';
import IconDropdown from './IconDropdown';
import { ZH_CONVERSION_OPTIONS } from '../../utils/constants';

function ConversionDropdown({ value, onChange }) {
  return (
    <IconDropdown
      icon={<Languages size={20} strokeWidth={2.5} />}
      title="繁簡轉換"
      ariaLabel="選擇繁簡轉換"
      options={ZH_CONVERSION_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}

export default ConversionDropdown;
