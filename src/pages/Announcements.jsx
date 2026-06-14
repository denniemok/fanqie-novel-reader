import styled from 'styled-components';
import AnnouncementTopBar from '../components/announcement/AnnouncementTopBar';
import AnnouncementContent from '../components/announcement/AnnouncementContent';
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

function Announcements() {
  const [conversionMode, setConversionMode] = useConversionMode();

  return (
    <Page>
      <Main>
        <AnnouncementTopBar conversionMode={conversionMode} onConversionModeChange={setConversionMode} />
        <AnnouncementContent />
      </Main>
      <Footer />
    </Page>
  );
}

export default Announcements;
