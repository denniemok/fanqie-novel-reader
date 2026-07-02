import { BookImage } from 'lucide-react';
import IconDropdown from './IconDropdown';
import { BOOK_DISPLAY_VARIANT_OPTIONS } from '../../utils/constants';

export const BOOK_VARIANT_DROPDOWN_TITLE = '書名封面';

function BookVariantDropdown({ value, onChange, title = BOOK_VARIANT_DROPDOWN_TITLE }) {
  return (
    <IconDropdown
      icon={<BookImage size={20} strokeWidth={2.5} />}
      title={title}
      ariaLabel="選擇書名與封面版本"
      options={BOOK_DISPLAY_VARIANT_OPTIONS}
      value={value}
      onChange={onChange}
    />
  );
}

BookVariantDropdown.toolLabel = BOOK_VARIANT_DROPDOWN_TITLE;

export default BookVariantDropdown;
