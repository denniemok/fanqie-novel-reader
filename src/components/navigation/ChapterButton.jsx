import { useNavigate } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { IconButton } from '../ui/IconButton';
import { buildChapterUrl } from '../../utils/navigation';

export const CHAPTER_BUTTON_TITLE = '返回章節';

function ChapterButton({ bookId, itemId, title = CHAPTER_BUTTON_TITLE, disabled: disabledProp }) {
  const navigate = useNavigate();
  if (!bookId) return null;

  const disabled = disabledProp ?? !itemId;

  return (
    <IconButton
      type="button"
      title={title}
      disabled={disabled}
      onClick={() => {
        if (disabled || !itemId) return;
        navigate(buildChapterUrl(itemId, bookId));
      }}
    >
      <Bookmark size={20} strokeWidth={2.5} />
    </IconButton>
  );
}

ChapterButton.toolLabel = CHAPTER_BUTTON_TITLE;

export default ChapterButton;
