import NavPageLayout from '../components/layout/NavPageLayout';
import NavTopBar from '../components/layout/NavTopBar';
import DownloadContent from '../components/download/DownloadContent';
import { useConversionMode } from '../hooks/useConversionMode';

function Download() {
  const [conversionMode] = useConversionMode();

  return (
    <NavPageLayout>
      <NavTopBar pageTitle="下載" />
      <DownloadContent conversionMode={conversionMode} />
    </NavPageLayout>
  );
}

export default Download;
