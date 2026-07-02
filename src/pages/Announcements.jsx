import NavPageLayout from '../components/layout/NavPageLayout';
import NavTopBar from '../components/layout/NavTopBar';
import PageWrapper from '../components/layout/PageWrapper';
import Loading from '../components/ui/Loading';
import Error from '../components/ui/Error';
import AnnouncementsContent from '../components/announcements/AnnouncementsContent';
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
      <AnnouncementsContent announcements={announcements ?? []} />
    </NavPageLayout>
  );
}

export default Announcements;
