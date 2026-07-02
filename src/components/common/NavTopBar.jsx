import TopBarBase from './TopBarBase';
import HomeButton from './HomeButton';
import BookshelfButton from './BookshelfButton';
import DiscoverButton from './DiscoverButton';

function NavTopBar({ pageTitle }) {
  return (
    <TopBarBase pageTitle={pageTitle}>
      <HomeButton />
      <BookshelfButton />
      <DiscoverButton />
    </TopBarBase>
  );
}

export default NavTopBar;
