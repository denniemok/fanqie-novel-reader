import NavPageLayout from '../components/common/NavPageLayout';
import NavTopBar from '../components/common/NavTopBar';
import Content from '../components/discover/Content';
import { useConversionMode } from '../hooks/useConversionMode';

function Discover() {
  const [conversionMode] = useConversionMode();

  return (
    <NavPageLayout>
      <NavTopBar pageTitle="新書" />
      <Content conversionMode={conversionMode} />
    </NavPageLayout>
  );
}

export default Discover;
