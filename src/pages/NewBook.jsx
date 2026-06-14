import NewBookTopBar from '../components/newbook/NewBookTopBar';
import NewBookContent from '../components/newbook/NewBookContent';
import Footer from '../components/home/Footer';
import { useConversionMode } from '../hooks/useConversionMode';

function NewBook() {
  const [conversionMode, setConversionMode] = useConversionMode();

  return (
    <>
      <NewBookTopBar conversionMode={conversionMode} onConversionModeChange={setConversionMode} />
      <NewBookContent />
      <Footer />
    </>
  );
}

export default NewBook;
