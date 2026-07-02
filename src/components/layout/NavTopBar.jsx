import TopBarBase from './TopBarBase';
import NavButtons from '../navigation/NavButtons';

function NavTopBar({ pageTitle }) {
  return (
    <TopBarBase pageTitle={pageTitle}>
      <NavButtons />
    </TopBarBase>
  );
}

export default NavTopBar;
