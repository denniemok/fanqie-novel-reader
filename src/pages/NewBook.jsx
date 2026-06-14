import styled from 'styled-components';
import NewBookTopBar from '../components/newbook/NewBookTopBar';
import NewBookContent from '../components/newbook/NewBookContent';
import Footer from '../components/common/Footer';
import { useConversionMode } from '../hooks/useConversionMode';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

function NewBook() {
  const [conversionMode, setConversionMode] = useConversionMode();

  return (
    <Page>
      <Main>
        <NewBookTopBar conversionMode={conversionMode} onConversionModeChange={setConversionMode} />
        <NewBookContent />
      </Main>
      <Footer />
    </Page>
  );
}

export default NewBook;
