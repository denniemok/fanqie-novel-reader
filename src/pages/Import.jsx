import NavPageLayout from '../components/common/NavPageLayout';
import NavTopBar from '../components/common/NavTopBar';
import ImportContent from '../components/migrate/ImportContent';
import { useConversionMode } from '../hooks/useConversionMode';

function Import() {
  const [conversionMode, setConversionMode] = useConversionMode();

  return (
    <NavPageLayout>
      <NavTopBar pageTitle="匯入資料" conversionMode={conversionMode} onConversionModeChange={setConversionMode} />
      <ImportContent />
    </NavPageLayout>
  );
}

export default Import;
