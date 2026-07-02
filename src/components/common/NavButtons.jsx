import HomeButton from './HomeButton';
import BookshelfButton from './BookshelfButton';
import DiscoverButton from './DiscoverButton';
import DownloadButton from './DownloadButton';

export const NAV_BUTTON_COMPONENTS = [
  HomeButton,
  BookshelfButton,
  DiscoverButton,
  DownloadButton,
];

function NavButtons() {
  return (
    <>
      {NAV_BUTTON_COMPONENTS.map((Btn, index) => (
        <Btn key={Btn.toolLabel ?? index} />
      ))}
    </>
  );
}

export default NavButtons;
