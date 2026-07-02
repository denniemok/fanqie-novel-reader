import { FolderInput } from 'lucide-react';
import BookInfo from '../common/BookInfo';
import { CardActionButton } from '../common/CardActionButton';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { normalizeDiscoverBookPayload } from '../../utils/bookInfo';
import { cardKeyDownHandler } from '../../utils/cardInteraction';
import {
  ListCard,
  ListCardBody,
  ListCardActionOverlay,
  ListCardActionFooter,
} from './styles';

function DiscoverBookListCard({ book, conversionMode, onClick, onAddToCollection }) {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const bookId = String(book.book_id);

  const actionButton = onAddToCollection ? (
    <CardActionButton
      type="button"
      $variant="collection"
      onClick={(e) => {
        e.stopPropagation();
        onAddToCollection(bookId);
      }}
      title="加入收藏夾"
      aria-label="加入收藏夾"
    >
      <FolderInput />
    </CardActionButton>
  ) : null;

  const actionHandlers = {
    onClick: (e) => e.stopPropagation(),
    onTouchStart: (e) => e.stopPropagation(),
  };

  return (
    <ListCard
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={cardKeyDownHandler(onClick)}
    >
      {actionButton && !isMobile && (
        <ListCardActionOverlay {...actionHandlers}>
          {actionButton}
        </ListCardActionOverlay>
      )}
      <ListCardBody>
        <BookInfo
          bookInfo={normalizeDiscoverBookPayload(book)}
          conversionMode={conversionMode}
          variant="compact"
        />
      </ListCardBody>
      {actionButton && isMobile && (
        <ListCardActionFooter {...actionHandlers}>
          {actionButton}
        </ListCardActionFooter>
      )}
    </ListCard>
  );
}

export default DiscoverBookListCard;
