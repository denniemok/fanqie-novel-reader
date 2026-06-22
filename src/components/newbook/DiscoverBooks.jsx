import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { fetchTopBookList, fetchRecommendedBookList } from '../../services/api';
import { buildCatalogUrl } from '../../utils/navigation';
import { formatErrorMessage } from '../../utils/errors';
import { useConvertedText } from '../../hooks/useConvertedText';
import { shimmerStyle } from '../../utils/styled/animations';
import { GridLayout, TabBar, Tab } from '../bookshelf/styles';
import Section from './Section';
import EmptyHint from '../common/EmptyHint';
import Help from './Help';
import Form from './Form';

const TABS = [
  { id: 'hot', label: '熱門' },
  { id: 'male', label: '男頻推薦' },
  { id: 'female', label: '女頻推薦' },
  { id: 'others', label: '其他' },
];

const TAB_FETCHERS = {
  hot: (opts) => fetchTopBookList(opts),
  male: (opts) => fetchRecommendedBookList(2, opts),
  female: (opts) => fetchRecommendedBookList(3, opts),
};

const TAB_ERROR_MESSAGES = {
  hot: '獲取熱門書籍失敗，請稍後再試。',
  male: '獲取男頻推薦失敗，請稍後再試。',
  female: '獲取女頻推薦失敗，請稍後再試。',
};

const OthersPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background: var(--card-surface);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  box-shadow: var(--retro-shadow);
  transition: var(--transition-default);

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, var(--accent-soft) 0%, transparent 55%);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
  }

  &:hover {
    border-color: var(--accent-color);
    background-color: var(--hover-background-color);
    transform: translate(-2px, -2px);
    box-shadow: var(--retro-shadow-hover);

    &::after {
      opacity: 0.5;
    }

    img {
      transform: scale(1.03);
    }
  }

  &:active {
    transform: translate(1px, 1px);
    box-shadow: none;
  }
`;

const CoverWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const CoverImg = styled.img`
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  background-color: var(--cover-bg);
  opacity: 0.9;
  border-bottom: 1px solid var(--border-color);
  display: block;
  transition: transform 0.35s cubic-bezier(0.34, 1.4, 0.64, 1);
`;

const CoverPlaceholder = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  background-color: var(--cover-bg);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: var(--text-color-secondary);
`;

const CoverMetaOverlayBottom = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  max-width: 100%;
  padding: 6px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  pointer-events: none;
`;

const CoverMetaLine = styled.div`
  font-size: 10px;
  font-weight: 700;
  color: var(--text-on-accent);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  width: fit-content;
  max-width: 100%;
  box-sizing: border-box;
  padding: 3px 6px;
  background: rgba(201, 128, 154, 0.85);
  border: 1px solid rgba(255, 248, 245, 0.4);
`;

const Info = styled.div`
  padding: 8px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-height: 62px;
  box-sizing: border-box;

  @media (max-width: 480px) {
    min-height: 58px;
  }
`;

const Title = styled.div`
  font-size: 13px;
  font-weight: 600;
  font-family: var(--display-font-family);
  color: var(--text-color);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.35;
  min-height: calc(13px * 1.35 * 2);

  @media (max-width: 480px) {
    font-size: 12px;
    min-height: calc(12px * 1.35 * 2);
  }
`;

const Author = styled.div`
  font-size: 11px;
  color: var(--accent-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.85;
  min-height: 11px;
`;

const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background-color: var(--background-color2);
  border: var(--retro-border-width) solid var(--border-color);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
  box-shadow: var(--retro-shadow);
`;

const SkeletonCover = styled.div`
  width: 100%;
  aspect-ratio: 3 / 4;
  ${shimmerStyle}
`;

const SkeletonText = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SkeletonLine = styled.div`
  height: ${(p) => p.$height || '12px'};
  width: ${(p) => p.$width || '100%'};
  ${shimmerStyle}
`;

function DiscoverBookCard({ book, conversionMode, onClick }) {
  const convertedName = useConvertedText(book.book_name, conversionMode);
  const convertedAuthor = useConvertedText(book.author, conversionMode);
  const convertedCategory = useConvertedText(book.category, conversionMode);

  return (
    <Card
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <CoverWrapper>
        {book.thumb_url ? (
          <CoverImg src={book.thumb_url} alt="" loading="lazy" />
        ) : (
          <CoverPlaceholder>無封面</CoverPlaceholder>
        )}
        {convertedCategory && (
          <CoverMetaOverlayBottom>
            <CoverMetaLine>{convertedCategory}</CoverMetaLine>
          </CoverMetaOverlayBottom>
        )}
      </CoverWrapper>
      <Info>
        <Title>{convertedName || book.book_id}</Title>
        <Author>{convertedAuthor || '\u00A0'}</Author>
      </Info>
    </Card>
  );
}

function DiscoverBooks({ conversionMode = 'tw' }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('others');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (activeTab === 'others') {
      setLoading(false);
      setError(null);
      setBooks([]);
      return undefined;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setBooks([]);

    TAB_FETCHERS[activeTab]({ signal: controller.signal })
      .then((list) => {
        setBooks(list);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        console.error('獲取書籍列表失敗:', activeTab, err);
        setError(formatErrorMessage(err, TAB_ERROR_MESSAGES[activeTab]));
        setLoading(false);
      });

    return () => controller.abort();
  }, [activeTab]);

  return (
    <Section>
      <TabBar>
        {TABS.map((tab) => (
          <Tab
            key={tab.id}
            type="button"
            $active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabBar>

      {activeTab === 'others' && (
        <OthersPanel>
          <Form embedded autoFocus />
          <Help embedded />
        </OthersPanel>
      )}

      {activeTab !== 'others' && loading && (
        <GridLayout>
          {Array.from({ length: 8 }, (_, i) => (
            <SkeletonCard key={i}>
              <SkeletonCover />
              <SkeletonText>
                <SkeletonLine $height="13px" $width="90%" />
                <SkeletonLine $height="11px" $width="60%" />
              </SkeletonText>
            </SkeletonCard>
          ))}
        </GridLayout>
      )}

      {activeTab !== 'others' && !loading && error && <EmptyHint>{error}</EmptyHint>}

      {activeTab !== 'others' && !loading && !error && books.length === 0 && (
        <EmptyHint>暫無書籍</EmptyHint>
      )}

      {activeTab !== 'others' && !loading && !error && books.length > 0 && (
        <GridLayout>
          {books.map((book) => (
            <DiscoverBookCard
              key={book.book_id}
              book={book}
              conversionMode={conversionMode}
              onClick={() => navigate(buildCatalogUrl(book.book_id))}
            />
          ))}
        </GridLayout>
      )}
    </Section>
  );
}

export default DiscoverBooks;
