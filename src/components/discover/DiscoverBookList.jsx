import { GridLayout, ListLayout } from '../bookshelf/styles';
import DiscoverBookGridCard from './DiscoverBookGridCard';
import DiscoverBookListCard from './DiscoverBookListCard';

function DiscoverBookList({
  viewMode,
  sortedBooks,
  baseBookCardProps,
  bookListCardProps,
}) {
  if (viewMode === 'list') {
    return (
      <ListLayout>
        {sortedBooks.map((book) => (
          <DiscoverBookListCard key={book.book_id} {...bookListCardProps(book)} />
        ))}
      </ListLayout>
    );
  }

  return (
    <GridLayout>
      {sortedBooks.map((book) => (
        <DiscoverBookGridCard key={book.book_id} {...baseBookCardProps(book)} />
      ))}
    </GridLayout>
  );
}

export default DiscoverBookList;
