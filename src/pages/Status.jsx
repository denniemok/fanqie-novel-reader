import NavPageLayout from '../components/common/NavPageLayout';
import NavTopBar from '../components/common/NavTopBar';
import Content from '../components/status/Content';
import { useConversionMode } from '../hooks/useConversionMode';

function Status() {
  const [conversionMode, setConversionMode] = useConversionMode();

  return (
    <NavPageLayout>
      <NavTopBar pageTitle="API 狀態" conversionMode={conversionMode} onConversionModeChange={setConversionMode} />
      <Content />
    </NavPageLayout>
  );
}

export default Status;
