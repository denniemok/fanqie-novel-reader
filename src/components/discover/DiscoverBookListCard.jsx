import BookInfo from '../common/BookInfo';
import { normalizeDiscoverBookInfo } from '../../utils/bookInfo';
import { cardKeyDownHandler } from '../../utils/cardInteraction';
import { ListCard } from './styles';

function toDiscoverBookInfo(book) {
  return { book_info: normalizeDiscoverBookInfo(book) };
}

function DiscoverBookListCard({ book, conversionMode, onClick }) {
  return (
    <ListCard
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={cardKeyDownHandler(onClick)}
    >
      <BookInfo
        bookInfo={toDiscoverBookInfo(book)}
        conversionMode={conversionMode}
        variant="compact"
        showChapterCount={false}
      />
    </ListCard>
  );
}

export default DiscoverBookListCard;
