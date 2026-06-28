import NavPageLayout from '../components/common/NavPageLayout';
import NavTopBar from '../components/common/NavTopBar';
import Content from '../components/download/Content';
import { useConversionMode } from '../hooks/useConversionMode';

function Download() {
  const [conversionMode, setConversionMode] = useConversionMode();

  return (
    <NavPageLayout>
      <NavTopBar pageTitle="下載" conversionMode={conversionMode} onConversionModeChange={setConversionMode} />
      <Content conversionMode={conversionMode} />
    </NavPageLayout>
  );
}

export default Download;
