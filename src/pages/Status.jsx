import NavPageLayout from '../components/common/NavPageLayout';
import NavTopBar from '../components/common/NavTopBar';
import PageWrapper from '../components/common/PageWrapper';
import Loading from '../components/common/Loading';
import Error from '../components/common/Error';
import Content from '../components/status/Content';
import { useConversionMode } from '../hooks/useConversionMode';
import { useApiStatusStore } from '../hooks/useApiStatus';

function Status() {
  const [conversionMode, setConversionMode] = useConversionMode();
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
      <NavTopBar pageTitle="API 狀態" conversionMode={conversionMode} onConversionModeChange={setConversionMode} />
      <Content />
    </NavPageLayout>
  );
}

export default Status;
