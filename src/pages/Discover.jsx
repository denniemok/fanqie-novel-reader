import NavPageLayout from '../components/layout/NavPageLayout';
import NavTopBar from '../components/layout/NavTopBar';
import DiscoverContent from '../components/discover/DiscoverContent';
import { useConversionMode } from '../hooks/useConversionMode';

function Discover() {
  const [conversionMode] = useConversionMode();

  return (
    <NavPageLayout>
      <NavTopBar pageTitle="新書" />
      <DiscoverContent conversionMode={conversionMode} />
    </NavPageLayout>
  );
}

export default Discover;
