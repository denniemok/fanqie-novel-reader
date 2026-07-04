import HomeButton from './HomeButton';
import BookshelfButton from './BookshelfButton';
import DiscoverButton from './DiscoverButton';
import CatalogButton from './CatalogButton';
import ChapterButton from './ChapterButton';

export const NAV_BUTTON_COMPONENTS = [
  HomeButton,
  BookshelfButton,
  DiscoverButton,
];

function NavButtons({ variant = 'default', bookId, lastReadItemId }) {
  if (variant === 'chapter') {
    return (
      <>
        <HomeButton />
        <BookshelfButton />
        {bookId && <CatalogButton bookId={bookId} />}
      </>
    );
  }

  if (variant === 'catalog') {
    return (
      <>
        <HomeButton />
        <BookshelfButton />
        {bookId && <ChapterButton bookId={bookId} itemId={lastReadItemId} />}
      </>
    );
  }

  if (variant === 'comments') {
    return (
      <>
        <HomeButton />
        <BookshelfButton />
        {bookId && <CatalogButton bookId={bookId} />}
      </>
    );
  }

  return (
    <>
      {NAV_BUTTON_COMPONENTS.map((Btn, index) => (
        <Btn key={Btn.toolLabel ?? index} />
      ))}
    </>
  );
}

export default NavButtons;
