import TopBarBase from './TopBarBase';
import NavButtons from './NavButtons';

function NavTopBar({ pageTitle }) {
  return (
    <TopBarBase pageTitle={pageTitle}>
      <NavButtons />
    </TopBarBase>
  );
}

export default NavTopBar;
