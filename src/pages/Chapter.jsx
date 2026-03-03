import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { fetchItem } from '../api';
import styled from 'styled-components';
import TopBar from '../components/TopBar';
import BottomBar from '../components/BottomBar';
import Main from '../components/Main';
import Error from '../components/Error';
import MyHead from '../components/MyHead';
import LoadingPage from '../components/LoadingPage';
import {
  BOOK_ID_KEY,
  FONT_SIZE_MIN,
  FONT_SIZE_MAX,
  FONT_SIZE_STEP,
  TEXT_BRIGHTNESS_MIN,
  TEXT_BRIGHTNESS_MAX,
  TEXT_BRIGHTNESS_STEP,
} from '../utils/constants';
import { safeGetItem, setLastReadChapter, getFontSize, setFontSize, getTextBrightness, setTextBrightness, getUseTraditionalChinese, setUseTraditionalChinese } from '../utils/storage';
import { formatErrorMessage } from '../utils/errors';
import { fetchBookWithDetail } from '../utils/api-helpers';

const ChapterWrapper = styled.div`
  background-color: var(--background-color);
  min-height: 100dvh;
  min-height: 100vh;
  overflow-x: hidden;
  width: 100%;
`;

function buildNovelDataFromDirectory(itemId, bookId, itemDataList) {
  const list = itemDataList || [];
  const index = list.findIndex((item) => String(item.item_id) === String(itemId));
  if (index < 0) return null;
  const item = list[index];
  return {
    book_id: bookId,
    book_name: '',
    title: item.title,
    order: String(index + 1),
    serial_count: String(list.length),
    pre_item_id: list[index - 1]?.item_id ?? null,
    next_item_id: list[index + 1]?.item_id ?? null,
    author: '',
    abstract: '',
    create_time: '',
  };
}

function Chapter() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const itemId = searchParams.get('itemId');
  const bookId = searchParams.get('bookId') || safeGetItem(BOOK_ID_KEY);
  const [error, setError] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [bookInfo, setBookInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSizeState] = useState(getFontSize);
  const [textBrightness, setTextBrightnessState] = useState(getTextBrightness);
  const [useTraditionalChinese, setUseTraditionalChineseState] = useState(getUseTraditionalChinese);

  const handleFontSizeChange = (delta) => {
    setFontSizeState((prev) => {
      const next = prev + delta * FONT_SIZE_STEP;
      const clamped = Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, next));
      setFontSize(clamped);
      return clamped;
    });
  };

  const handleTextBrightnessChange = (delta) => {
    setTextBrightnessState((prev) => {
      const next = prev + delta * TEXT_BRIGHTNESS_STEP;
      const clamped = Math.max(TEXT_BRIGHTNESS_MIN, Math.min(TEXT_BRIGHTNESS_MAX, next));
      setTextBrightness(clamped);
      return clamped;
    });
  };

  const loadChapter = useCallback((forceRefresh = false) => {
    if (!itemId) return;
    setLoading(true);
    setError(null);
    const loadPromise = bookId
      ? Promise.all([
          fetchItem(itemId, { forceRefresh }),
          fetchBookWithDetail(bookId, { forceRefresh: false }),
        ]).then(([contentRes, mergedBookInfo]) => {
          const contentData = contentRes.data.data;
          const novelData = buildNovelDataFromDirectory(itemId, bookId, mergedBookInfo.item_data_list);
          return {
            chapterData: { ...contentData, novel_data: novelData },
            bookInfo: mergedBookInfo,
          };
        })
      : fetchItem(itemId, { forceRefresh }).then((response) => ({
          chapterData: response.data.data,
          bookInfo: null,
        }));

    loadPromise
      .then(({ chapterData: data, bookInfo: info }) => {
        setChapterData(data);
        setBookInfo(info);
        if (bookId && itemId) {
          setLastReadChapter(bookId, itemId);
        }
      })
      .catch((err) => {
        console.error('獲取章節內容失敗:', err);
        const msg = formatErrorMessage(
          err,
          '獲取章節內容失敗，來到沒有內容的荒原，請返回目錄重試！'
        );
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [itemId, bookId]);

  const handleTraditionalChineseToggle = useCallback(() => {
    const next = !useTraditionalChinese;
    setUseTraditionalChinese(next); // Persist before loadChapter so applyChapterConversion reads the new value
    setUseTraditionalChineseState(next);
    loadChapter(false);
  }, [loadChapter, useTraditionalChinese]);

  useEffect(() => {
    if (itemId) loadChapter(false);
  }, [itemId, loadChapter]);

  const handleRefresh = () => loadChapter(true);

  if (!itemId) {
    return bookId ? <Navigate to={`/catalog?bookId=${bookId}`} replace /> : <Navigate to="/" replace />;
  }

  if (error) {
    return <Error message={error} href={bookId ? `/catalog?bookId=${bookId}` : '/'} />;
  }

  return (
    <ChapterWrapper>
      {loading ? (
        <LoadingPage onAbort={() => navigate('/')} />
      ) : (
        <>
          <MyHead bookInfo={bookInfo} chapterData={chapterData} />
          {chapterData && (
            <>
              <TopBar
                chapterData={chapterData}
                bookInfo={bookInfo}
                fontSize={fontSize}
                onFontSizeChange={handleFontSizeChange}
                textBrightness={textBrightness}
                onTextBrightnessChange={handleTextBrightnessChange}
                useTraditionalChinese={useTraditionalChinese}
                onTraditionalChineseToggle={handleTraditionalChineseToggle}
                onRefresh={handleRefresh}
              />
              <Main chapterData={chapterData} fontSize={fontSize} textBrightness={textBrightness} />
              <BottomBar chapterData={chapterData} bookId={bookId} />
            </>
          )}
        </>
      )}
    </ChapterWrapper>
  );
}

export default Chapter;
