import TopBarBase from './TopBarBase';
import NavButtons from '../navigation/NavButtons';

function NavTopBar({ pageTitle, navVariant, bookId, lastReadItemId }) {
  return (
    <TopBarBase pageTitle={pageTitle}>
      <NavButtons
        variant={navVariant}
        bookId={bookId}
        lastReadItemId={lastReadItemId}
      />
    </TopBarBase>
  );
}

export default NavTopBar;
