import NavPageLayout from '../components/layout/NavPageLayout';
import NavTopBar from '../components/layout/NavTopBar';
import PageContent from '../components/layout/PageContent';
import DiscoverBooks from '../components/discover/DiscoverBooks';
import { useConversionMode } from '../hooks/useConversionMode';

function Discover() {
  const [conversionMode] = useConversionMode();

  return (
    <NavPageLayout>
      <NavTopBar pageTitle="新書" />
      <PageContent>
        <DiscoverBooks conversionMode={conversionMode} />
      </PageContent>
    </NavPageLayout>
  );
}

export default Discover;
