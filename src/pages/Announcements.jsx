import AnnouncementTopBar from '../components/announcement/AnnouncementTopBar';
import AnnouncementContent from '../components/announcement/AnnouncementContent';
import { useConversionMode } from '../hooks/useConversionMode';

function Announcements() {
  const [conversionMode, setConversionMode] = useConversionMode();

  return (
    <>
      <AnnouncementTopBar conversionMode={conversionMode} onConversionModeChange={setConversionMode} />
      <AnnouncementContent />
    </>
  );
}

export default Announcements;
