import TopBarBase from '../common/TopBarBase';
import HomeButton from '../common/HomeButton';
import BookshelfButton from '../common/BookshelfButton';

function TopBar() {
  return (
    <TopBarBase pageTitle="評論">
      <HomeButton />
      <BookshelfButton />
    </TopBarBase>
  );
}

export default TopBar;
