import NavPageLayout from '../components/layout/NavPageLayout';
import NavTopBar from '../components/layout/NavTopBar';
import PageContent from '../components/layout/PageContent';
import DownloadProgress from '../components/download/DownloadProgress';
import DownloadGuide from '../components/download/DownloadGuide';
import { useConversionMode } from '../hooks/useConversionMode';

function Download() {
  const [conversionMode] = useConversionMode();

  return (
    <NavPageLayout>
      <NavTopBar pageTitle="下載" />
      <PageContent $paddingBottom={48} $paddingBottomMobile={32}>
        <DownloadProgress conversionMode={conversionMode} />
        <DownloadGuide />
      </PageContent>
    </NavPageLayout>
  );
}

export default Download;
