import { Languages } from 'lucide-react';
import IconDropdown from './IconDropdown';
import { ZH_CONVERSION_OPTIONS } from '../../utils/constants';

export const LANG_DROPDOWN_TITLE = '繁簡轉換';

function LangDropdown({ value, onChange, title = LANG_DROPDOWN_TITLE }) {
  return (
    <IconDropdown
      icon={<Languages size={20} strokeWidth={2.5} />}
      title={title}
      ariaLabel="選擇繁簡轉換"
      options={ZH_CONVERSION_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}

export default LangDropdown;
