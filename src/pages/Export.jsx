import NavPageLayout from '../components/common/NavPageLayout';
import NavTopBar from '../components/common/NavTopBar';
import ExportContent from '../components/migrate/ExportContent';
import { useConversionMode } from '../hooks/useConversionMode';

function Export() {
  const [conversionMode, setConversionMode] = useConversionMode();

  return (
    <NavPageLayout>
      <NavTopBar pageTitle="匯出資料" conversionMode={conversionMode} onConversionModeChange={setConversionMode} />
      <ExportContent />
    </NavPageLayout>
  );
}

export default Export;
