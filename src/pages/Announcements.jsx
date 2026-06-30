import NavPageLayout from '../components/common/NavPageLayout';
import NavTopBar from '../components/common/NavTopBar';
import PageWrapper from '../components/common/PageWrapper';
import Loading from '../components/common/Loading';
import Error from '../components/common/Error';
import Content from '../components/announcement/Content';
import { useConversionMode } from '../hooks/useConversionMode';
import { useAnnouncements } from '../hooks/useAnnouncements';

function Announcements() {
  const [conversionMode, setConversionMode] = useConversionMode();
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
      <NavTopBar pageTitle="公告" conversionMode={conversionMode} onConversionModeChange={setConversionMode} />
      <Content announcements={announcements ?? []} />
    </NavPageLayout>
  );
}

export default Announcements;
