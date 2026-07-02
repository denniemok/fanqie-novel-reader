import { useEffect, useCallback, useState } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import TopBar from '../components/chapter/TopBar';
import BottomBar from '../components/chapter/BottomBar';
import Reader from '../components/chapter/Reader';
import ReaderControlsPanel from '../components/chapter/ReaderControlsPanel';
import Error from '../components/common/Error';
import Loading from '../components/common/Loading';
import PageWrapper from '../components/common/PageWrapper';
import { useConversionMode } from '../hooks/useConversionMode';
import { useFontSize, useFontFamily, useTextBrightness, useReaderBackground } from '../hooks/useTextSettings';
import { useChapterLoader } from '../hooks/useChapterLoader';
import { buildCatalogUrl, ROUTES } from '../utils/navigation';
import { useErrorToast } from '../hooks/useErrorToast';

function Chapter() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemId = searchParams.get('itemId');
  const bookId = searchParams.get('bookId');
  
  const { error, chapterData, bookInfo, loading, loadChapter } = useChapterLoader(itemId, bookId);
  const [fontSize, handleFontSizeChange] = useFontSize();
  const [fontFamily, handleFontFamilyChange] = useFontFamily();
  const [textBrightness, handleTextBrightnessChange] = useTextBrightness();
  const [readerBackground, handleReaderBackgroundChange] = useReaderBackground();
  const [conversionMode] = useConversionMode();
  const [readerControlsOpen, setReaderControlsOpen] = useState(false);

  const handleRefresh = useCallback(() => {
    loadChapter(true);
  }, [loadChapter]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [itemId]);

  useEffect(() => {
    setReaderControlsOpen(false);
  }, [itemId]);

  useErrorToast(error);

  if (!itemId) {
    return bookId ? <Navigate to={buildCatalogUrl(bookId)} replace /> : <Navigate to={ROUTES.home} replace />;
  }

  if (error) {
    return <Error message={error} href={bookId ? buildCatalogUrl(bookId) : '/'} />;
  }

  return (
    <PageWrapper $withBottomPadding={false} $backgroundColor={loading ? undefined : readerBackground}>
      {loading ? (
        <Loading onAbort={() => navigate(bookId ? buildCatalogUrl(bookId) : '/')} />
      ) : (
        <>
          {chapterData && (
            <>
              <TopBar
                chapterData={chapterData}
                bookInfo={bookInfo}
                bookId={bookId}
                itemId={itemId}
                conversionMode={conversionMode}
                readerControlsOpen={readerControlsOpen}
                onReaderControlsToggle={() => setReaderControlsOpen((open) => !open)}
              />
              <ReaderControlsPanel
                open={readerControlsOpen}
                onClose={() => setReaderControlsOpen(false)}
                bookId={bookId ?? chapterData?.novel_data?.book_id}
                onRefresh={handleRefresh}
                fontSize={fontSize}
                onFontSizeChange={handleFontSizeChange}
                fontFamily={fontFamily}
                onFontFamilyChange={handleFontFamilyChange}
                textBrightness={textBrightness}
                onTextBrightnessChange={handleTextBrightnessChange}
                readerBackground={readerBackground}
                onReaderBackgroundChange={handleReaderBackgroundChange}
              />
              <Reader chapterData={chapterData} fontSize={fontSize} fontFamily={fontFamily} textBrightness={textBrightness} readerBackground={readerBackground} conversionMode={conversionMode} />
              <BottomBar chapterData={chapterData} bookId={bookId} />
            </>
          )}
        </>
      )}
    </PageWrapper>
  );
}

export default Chapter;
