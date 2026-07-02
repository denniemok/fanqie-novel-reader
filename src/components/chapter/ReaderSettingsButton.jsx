import { SlidersHorizontal } from 'lucide-react';
import { IconButton } from '../common/IconButton';

export const READER_SETTINGS_BUTTON_TITLE = '閱讀設定';

function ReaderSettingsButton({
  active = false,
  onToggle,
  title = READER_SETTINGS_BUTTON_TITLE,
}) {
  return (
    <IconButton
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      $active={active}
      onClick={onToggle}
    >
      <SlidersHorizontal size={20} strokeWidth={2.5} />
    </IconButton>
  );
}

ReaderSettingsButton.toolLabel = '閱讀';

export default ReaderSettingsButton;
