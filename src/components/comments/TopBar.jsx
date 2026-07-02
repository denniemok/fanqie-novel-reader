import { RefreshCw } from 'lucide-react';
import TopBarBase from '../common/TopBarBase';
import HomeButton from '../common/HomeButton';
import BookshelfButton from '../common/BookshelfButton';
import CatalogButton from '../common/CatalogButton';
import ApiDropdown from '../common/ApiDropdown';
import LangDropdown from '../common/LangDropdown';
import BookVariantDropdown from '../common/BookVariantDropdown';
import { IconButton } from '../common/IconButton';
import { useBookDisplayVariant } from '../../contexts/BookDisplayVariantContext';

function TopBar({ bookId, conversionMode, onConversionModeChange, onRefresh }) {
  const { variant, setVariant } = useBookDisplayVariant();

  return (
    <TopBarBase pageTitle="評論">
      <HomeButton />
      <BookshelfButton />
      <ApiDropdown />
      <BookVariantDropdown value={variant} onChange={setVariant} />
      <LangDropdown value={conversionMode} onChange={onConversionModeChange} />
      <IconButton type="button" title="刷新評論" onClick={onRefresh}>
        <RefreshCw size={20} strokeWidth={2.5} />
      </IconButton>
      <CatalogButton bookId={bookId} />
    </TopBarBase>
  );
}

export default TopBar;
