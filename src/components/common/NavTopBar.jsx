import TopBarBase from './TopBarBase';
import HomeButton from './HomeButton';
import BookshelfButton from './BookshelfButton';
import DiscoverButton from './DiscoverButton';
import ApiDropdown from './ApiDropdown';
import LangDropdown from './LangDropdown';

function NavTopBar({ pageTitle, conversionMode, onConversionModeChange }) {
  return (
    <TopBarBase pageTitle={pageTitle}>
      <HomeButton />
      <BookshelfButton />
      <DiscoverButton />
      <ApiDropdown />
      <LangDropdown value={conversionMode} onChange={onConversionModeChange} />
    </TopBarBase>
  );
}

export default NavTopBar;
