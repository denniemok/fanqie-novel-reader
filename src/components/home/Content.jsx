import PageContent from '../common/PageContent';
import NavGrid from './NavGrid';
import MigrationNotice from './MigrationNotice';
import PinnedNotice from './PinnedNotice';

function Content() {
  return (
    <PageContent $variant="home" $paddingBottom={24} $paddingBottomMobile={20}>
      <MigrationNotice />
      <PinnedNotice />
      <NavGrid />
    </PageContent>
  );
}

export default Content;
