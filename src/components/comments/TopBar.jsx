import { RefreshCw } from 'lucide-react';
import TopBarBase from '../common/TopBarBase';
import HomeButton from '../common/HomeButton';
import BookshelfButton from '../common/BookshelfButton';
import CatalogButton from '../common/CatalogButton';
import { IconButton } from '../common/IconButton';

function TopBar({ bookId, onRefresh }) {
  return (
    <TopBarBase pageTitle="評論">
      <HomeButton />
      <BookshelfButton />
      <IconButton type="button" title="刷新評論" onClick={onRefresh}>
        <RefreshCw size={20} strokeWidth={2.5} />
      </IconButton>
      <CatalogButton bookId={bookId} />
    </TopBarBase>
  );
}

export default TopBar;
