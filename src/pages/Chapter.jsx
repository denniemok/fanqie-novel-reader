import { useEffect, useLayoutEffect, useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import ChapterTopBar from '../components/chapter/ChapterTopBar';
import BottomBar from '../components/chapter/BottomBar';
import Reader from '../components/chapter/Reader';
import ReaderControlsPanel from '../components/chapter/ReaderControlsPanel';
import Error from '../components/ui/Error';
import Loading from '../components/ui/Loading';
import PageWrapper from '../components/layout/PageWrapper';
import { useConversionMode } from '../hooks/useConversionMode';
import { useFontSize, useFontFamily, useTextBrightness, useReaderBackground } from '../hooks/useTextSettings';
import { useChapterLoader } from '../hooks/book/useChapterLoader';
import { useChapterChromeHeights } from '../hooks/useChapterChromeHeights';
import { buildCatalogUrl, ROUTES } from '../utils/navigation';

const ChapterFrame = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`;

const ReaderPane = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
`;

function Chapter() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemId = searchParams.get('itemId');
  const bookId = searchParams.get('bookId');
  
  const { error, chapterData, bookInfo, loading, loadChapter } = useChapterLoader(itemId, bookId);
  const [fontSize, handleFontSizeChange] = useFontSize();
  const [fontFamily, handleFontFamilyChange] = useFontFamily();
  const [textBrightness, handleTextBrightnessChange] = useTextBrightness();
  const {
    readerBackground,
    readerBackgroundColor,
    readerTextColor,
    readerCustomBg,
    readerCustomText,
    handleReaderBackgroundChange,
    handleCustomBgChange,
    handleCustomTextChange,
  } = useReaderBackground();
  const [conversionMode] = useConversionMode();
  const [readerControlsOpen, setReaderControlsOpen] = useState(false);
  const readerPaneRef = useRef(null);
  const chapterFrameRef = useRef(null);
  useChapterChromeHeights(chapterFrameRef, !!chapterData);

  const handleRefresh = useCallback(() => {
    loadChapter(true);
  }, [loadChapter]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    readerPaneRef.current?.scrollTo(0, 0);
  }, [itemId]);

  useEffect(() => {
    setReaderControlsOpen(false);
  }, [itemId]);

  if (!itemId) {
    return bookId ? <Navigate to={buildCatalogUrl(bookId)} replace /> : <Navigate to={ROUTES.home} replace />;
  }

  if (error) {
    return <Error message={error} href={bookId ? buildCatalogUrl(bookId) : '/'} />;
  }

  const isInitialLoad = loading && !chapterData;

  return (
    <PageWrapper
      $withBottomPadding={false}
      $fillViewport={!isInitialLoad && !!chapterData}
      $backgroundColor={isInitialLoad ? undefined : readerBackgroundColor}
    >
      {isInitialLoad ? (
        <Loading onAbort={() => navigate(bookId ? buildCatalogUrl(bookId) : '/')} />
      ) : (
        <>
          {chapterData && (
            <ChapterFrame ref={chapterFrameRef}>
              <ChapterTopBar
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
                onRefresh={handleRefresh}
                fontSize={fontSize}
                onFontSizeChange={handleFontSizeChange}
                fontFamily={fontFamily}
                onFontFamilyChange={handleFontFamilyChange}
                textBrightness={textBrightness}
                onTextBrightnessChange={handleTextBrightnessChange}
                readerBackground={readerBackground}
                onReaderBackgroundChange={handleReaderBackgroundChange}
                readerCustomBg={readerCustomBg}
                readerCustomText={readerCustomText}
                onCustomBgChange={handleCustomBgChange}
                onCustomTextChange={handleCustomTextChange}
              />
              <ReaderPane ref={readerPaneRef}>
                <Reader
                  chapterData={chapterData}
                  fontSize={fontSize}
                  fontFamily={fontFamily}
                  textBrightness={textBrightness}
                  readerTextColor={readerTextColor}
                  conversionMode={conversionMode}
                />
              </ReaderPane>
              <BottomBar chapterData={chapterData} bookId={bookId} />
            </ChapterFrame>
          )}
        </>
      )}
    </PageWrapper>
  );
}

export default Chapter;
