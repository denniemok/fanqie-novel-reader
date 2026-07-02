import NavPageLayout from '../components/layout/NavPageLayout';
import NavTopBar from '../components/layout/NavTopBar';
import PageWrapper from '../components/layout/PageWrapper';
import Loading from '../components/ui/Loading';
import Error from '../components/ui/Error';
import StatusContent from '../components/status/StatusContent';
import { useApiStatusStore } from '../hooks/api/useApiStatus';

function Status() {
  const { data, error, loading } = useApiStatusStore();

  if (loading && !data) {
    return (
      <PageWrapper>
        <Loading />
      </PageWrapper>
    );
  }

  if (error && !data) {
    return (
      <PageWrapper>
        <Error message={error} />
      </PageWrapper>
    );
  }

  return (
    <NavPageLayout>
      <NavTopBar pageTitle="API 狀態" />
      <StatusContent />
    </NavPageLayout>
  );
}

export default Status;
