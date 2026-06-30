import PageContent from '../common/PageContent';
import NavGrid from './NavGrid';
import MigrationNotice from './MigrationNotice';
import UrgentNotice from './UrgentNotice';

function Content() {
  return (
    <PageContent $variant="home" $paddingBottom={24} $paddingBottomMobile={20}>
      <MigrationNotice />
      <UrgentNotice />
      <NavGrid />
    </PageContent>
  );
}

export default Content;
