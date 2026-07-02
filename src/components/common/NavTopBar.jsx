import TopBarBase from './TopBarBase';
import HomeButton from './HomeButton';
import BookshelfButton from './BookshelfButton';
import DiscoverButton from './DiscoverButton';
import ApiDropdown from './ApiDropdown';
import LangDropdown from './LangDropdown';
import BookVariantDropdown from './BookVariantDropdown';
import { useBookDisplayVariant } from '../../contexts/BookDisplayVariantContext';

function NavTopBar({ pageTitle, conversionMode, onConversionModeChange }) {
  const { variant, setVariant } = useBookDisplayVariant();

  return (
    <TopBarBase pageTitle={pageTitle}>
      <HomeButton />
      <BookshelfButton />
      <DiscoverButton />
      <ApiDropdown />
      <BookVariantDropdown value={variant} onChange={setVariant} />
      <LangDropdown value={conversionMode} onChange={onConversionModeChange} />
    </TopBarBase>
  );
}

export default NavTopBar;
