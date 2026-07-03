import NavPageLayout from '../components/layout/NavPageLayout';
import NavTopBar from '../components/layout/NavTopBar';
import PageWrapper from '../components/layout/PageWrapper';
import PageContent from '../components/layout/PageContent';
import Loading from '../components/ui/Loading';
import Error from '../components/ui/Error';
import NoticeBoard from '../components/announcements/NoticeBoard';
import { useAnnouncements } from '../hooks/useAnnouncements';

function Announcements() {
  const { announcements, loading, error } = useAnnouncements();

  if (loading && announcements === null) {
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );
  }

  if (error && announcements === null) {
    return (
      <PageWrapper>
        <Error message={error} />
      </PageWrapper>
    );
  }

  return (
    <NavPageLayout>
      <NavTopBar pageTitle="公告" />
      <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
        <NoticeBoard announcements={announcements ?? []} />
      </PageContent>
    </NavPageLayout>
  );
}

export default Announcements;
