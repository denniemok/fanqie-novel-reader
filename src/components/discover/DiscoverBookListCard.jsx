import { FolderInput } from 'lucide-react';
import BookInfo from '../book/BookInfo';
import { CardActionButton } from '../book/CardActionButton';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { normalizeDiscoverBookPayload } from '../../utils/book/bookInfo';
import { cardKeyDownHandler } from '../../utils/cardInteraction';
import {
  DiscoverListCard,
  DiscoverListCardBody,
  DiscoverListCardActionOverlay,
  DiscoverListCardActionFooter,
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
    <DiscoverListCard
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={cardKeyDownHandler(onClick)}
    >
      {actionButton && !isMobile && (
        <DiscoverListCardActionOverlay {...actionHandlers}>
          {actionButton}
        </DiscoverListCardActionOverlay>
      )}
      <DiscoverListCardBody>
        <BookInfo
          bookInfo={normalizeDiscoverBookPayload(book)}
          conversionMode={conversionMode}
          variant="compact"
        />
      </DiscoverListCardBody>
      {actionButton && isMobile && (
        <DiscoverListCardActionFooter {...actionHandlers}>
          {actionButton}
        </DiscoverListCardActionFooter>
      )}
    </DiscoverListCard>
  );
}

export default DiscoverBookListCard;
