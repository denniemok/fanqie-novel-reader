import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowRight, Compass } from 'lucide-react';
import { getReadingHistory } from '../../utils/storage';
import { directoryCache } from '../../utils/cache';
import { getChapterTitle } from '../../utils/chapter-helpers';
import { useBookLoader } from '../../hooks/book/useBookLoader';
import { resolveBookDisplay } from '../../utils/book/bookInfo';
import { buildCatalogUrl, buildChapterUrl, buildDefaultDiscoverUrl } from '../../utils/navigation';
import { useBookDisplayVariant } from '../../contexts/BookDisplayVariantContext';
import { useConversionMode } from '../../hooks/useConversionMode';
import { useConvertedText } from '../../hooks/useConvertedText';
import BookCoverImg from '../book/BookCoverImg';

const Hero = styled.section`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 28px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--surface-raised);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  animation: homeCardEntrance 0.6s var(--ease-out) 0.1s both;
  @media (max-width: 480px) { gap: 18px; padding: 20px; }
`;
const HeroContent = styled.div`display: flex; flex-direction: column; align-items: flex-start; justify-content: center; min-width: 0; flex: 1;`;
const Eyebrow = styled.p`margin: 0 0 10px; color: var(--accent-color); font-size: 12px; font-weight: 500; letter-spacing: 0.24em;`;
const Heading = styled.h2`
  margin: 0; font-family: var(--display-font-family); font-size: clamp(22px, 4vw, 28px); font-weight: 600; letter-spacing: 0.04em; line-height: 1.35;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
`;
const Meta = styled.p`
  max-width: 100%; margin: 8px 0 22px; color: var(--text-color-secondary); font-size: 14px; letter-spacing: 0.04em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  .chapter { color: var(--text-color); }
`;
const ContinueButton = styled.button`
  display: inline-flex; align-items: center; gap: 10px; border: 1px solid var(--accent-color); border-radius: var(--border-radius-sketch); padding: 10px 20px;
  color: var(--text-on-accent); background: var(--accent-color); font: inherit; font-size: 14px; font-weight: 500; letter-spacing: 0.1em; cursor: pointer; transition: var(--transition-default);
  svg { width: 16px; height: 16px; transition: transform 0.25s var(--ease-out); }
  &:hover { background: var(--accent-hover); border-color: var(--accent-hover); svg { transform: translateX(3px); } }
  &:active { transform: scale(0.98); }
`;
const Cover = styled.img`
  flex-shrink: 0; width: 120px; aspect-ratio: 3 / 4; object-fit: cover; border-radius: var(--border-radius-xs);
  box-shadow: var(--cover-shadow); background: var(--cover-bg);
  @media (max-width: 480px) { width: 88px; }
`;

function formatLastRead(timestamp) {
  if (!timestamp) return '已加入書架';
  const days = Math.floor((Date.now() - timestamp) / 86400000);
  if (days <= 0) return '今天閱讀';
  if (days === 1) return '昨天閱讀';
  return `${days} 天前閱讀`;
}

function pickMostRecentEntry(history) {
  if (!Array.isArray(history) || history.length === 0) return null;
  return history.reduce((latest, entry) => {
    if (!latest) return entry;
    return (entry.lastReadAt || 0) > (latest.lastReadAt || 0) ? entry : latest;
  }, null);
}

function ContinueReading() {
  const navigate = useNavigate();
  const { variant } = useBookDisplayVariant();
  const [conversionMode] = useConversionMode();
  const [entry, setEntry] = useState(null);
  useEffect(() => {
    getReadingHistory().then((history) => setEntry(pickMostRecentEntry(history)));
  }, []);
  const { bookInfo } = useBookLoader(entry?.bookId, { detailOnly: true });
  const info = bookInfo?.book_info || bookInfo || {};
  const { book_name: bookName, thumb_url: thumbUrl, fallback_thumb_url: fallbackThumbUrl } = resolveBookDisplay(info, variant, entry?.bookId);
  const convertedBookName = useConvertedText(bookName, conversionMode);
  const [chapterTitle, setChapterTitle] = useState(null);
  useEffect(() => {
    if (!entry?.itemId) return undefined;
    let cancelled = false;
    // Cache-only lookup: the directory is stored once the book has been opened, so no request is needed.
    directoryCache.get(entry.bookId).then((directory) => {
      const item = directory?.item_data_list?.find((it) => String(it.item_id) === String(entry.itemId));
      if (!cancelled && item) setChapterTitle(getChapterTitle(item));
    });
    return () => { cancelled = true; };
  }, [entry]);
  const convertedChapterTitle = useConvertedText(chapterTitle, conversionMode);
  const hasHistory = Boolean(entry);
  const handleContinue = () => {
    if (!entry) return navigate(buildDefaultDiscoverUrl());
    return navigate(entry.itemId ? buildChapterUrl(entry.itemId, entry.bookId) : buildCatalogUrl(entry.bookId));
  };
  return (
    <Hero>
      <HeroContent>
        <Eyebrow>{hasHistory ? '繼續閱讀' : '私人書架'}</Eyebrow>
        <Heading>{hasHistory ? (convertedBookName || '最近閱讀') : '從一個故事開始'}</Heading>
        <Meta>
          {hasHistory ? formatLastRead(entry.lastReadAt) : '搜尋書名或輸入書籍 ID，建立你的私人書架。'}
          {hasHistory && convertedChapterTitle && <>：<span className="chapter">{convertedChapterTitle}</span></>}
        </Meta>
        <ContinueButton type="button" onClick={handleContinue}>{hasHistory ? '繼續閱讀' : '開始找書'}{hasHistory ? <ArrowRight aria-hidden /> : <Compass aria-hidden />}</ContinueButton>
      </HeroContent>
      {hasHistory && thumbUrl && <BookCoverImg url={thumbUrl} fallbackUrl={fallbackThumbUrl} ImgComponent={Cover} alt="" />}
    </Hero>
  );
}

export default ContinueReading;
