import NavPageLayout from '../components/common/NavPageLayout';
import NavTopBar from '../components/common/NavTopBar';
import Content from '../components/newbook/Content';
import { useConversionMode } from '../hooks/useConversionMode';

function NewBook() {
  const [conversionMode, setConversionMode] = useConversionMode();

  return (
    <NavPageLayout>
      <NavTopBar pageTitle="新書" conversionMode={conversionMode} onConversionModeChange={setConversionMode} />
      <Content conversionMode={conversionMode} />
    </NavPageLayout>
  );
}

export default NewBook;
