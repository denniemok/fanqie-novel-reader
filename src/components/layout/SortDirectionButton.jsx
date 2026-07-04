import { ArrowDownZA, ArrowUpAZ } from 'lucide-react';
import { BtnLabel, SortTrailingBtn } from './BookToolbarStyles';

function SortDirectionButton({ sortDirection, onToggle }) {
  return (
    <SortTrailingBtn
      type="button"
      onClick={onToggle}
      title={sortDirection === 'desc' ? '由高到低（點擊切換）' : '由低到高（點擊切換）'}
      aria-label={sortDirection === 'desc' ? '降序排列' : '升序排列'}
    >
      {sortDirection === 'desc' ? <ArrowDownZA /> : <ArrowUpAZ />}
      <BtnLabel>{sortDirection === 'desc' ? '降序' : '升序'}</BtnLabel>
    </SortTrailingBtn>
  );
}

export default SortDirectionButton;
