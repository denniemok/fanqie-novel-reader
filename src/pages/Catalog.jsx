import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Navigate, useNavigate, Link } from 'react-router-dom';
import { Bookmark, Languages, RefreshCw } from 'lucide-react';
import Menu from '../components/Menu';
import Info from '../components/Info';
import Error from '../components/Error';
import MyHead from '../components/MyHead';
import Sort from '../components/Sort';
import LoadingPage from '../components/LoadingPage';
import HomeButton from '../components/HomeButton';
import { IconButton } from '../components/IconButton';
import styled from 'styled-components';
import { BOOK_ID_KEY } from '../utils/constants';

const CatalogWrapper = styled.div`
  min-height: 100dvh;
  min-height: 100vh;
  overflow-x: hidden;
  width: 100%;
  background-color: var(--background-color);
  padding-bottom: env(safe-area-inset-bottom);
`;
import { safeSetItem, getLastReadChapter, getUseTraditionalChinese, setUseTraditionalChinese } from '../utils/storage';
import { formatErrorMessage } from '../utils/errors';
import { fetchBookWithDetail } from '../utils/api-helpers';

const BackBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  padding-top: calc(16px + env(safe-area-inset-top));
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  @media (max-width: 480px) {
    padding: 12px 16px;
    padding-top: calc(12px + env(safe-area-inset-top));
  }
`;

const CatalogContent = styled.div`
  padding-top: calc(76px + env(safe-area-inset-top));

  @media (max-width: 480px) {
    padding-top: calc(68px + env(safe-area-inset-top));
  }
`;

const SiteTitle = styled(Link)`
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    color: var(--accent-color);
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;

  @media (max-width: 480px) {
    gap: 2px;
  }
`;

function Catalog() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookId = searchParams.get('bookId');
  const lastReadItemId = bookId ? getLastReadChapter(bookId) : null;
  const [error, setError] = useState(null);
  const [bookInfo, setBookInfo] = useState(null);
  const [sortOrder, setSortOrder] = useState('ascending');
  const [useTraditionalChinese, setUseTraditionalChineseState] = useState(getUseTraditionalChinese);

  const loadBook = useCallback((forceRefresh = false) => {
    if (!bookId) return;
    if (forceRefresh) {
      setError(null);
      setBookInfo(null);
    }
    fetchBookWithDetail(bookId, { forceRefresh, catalogOnly: forceRefresh })
      .then((merged) => {
        setBookInfo(merged);
        safeSetItem(BOOK_ID_KEY, bookId);
      })
      .catch((err) => {
        console.error('獲取圖書資訊失敗：', err);
        const msg = formatErrorMessage(
          err,
          '獲取圖書資訊失敗，請檢查<span>bookId</span>是否正確，或者稍後再試。'
        );
        setError(msg);
      });
  }, [bookId]);

  useEffect(() => {
    if (bookId) loadBook(false);
  }, [bookId, loadBook]);

  const handleTraditionalChineseToggle = useCallback(() => {
    const next = !useTraditionalChinese;
    setUseTraditionalChinese(next);
    setUseTraditionalChineseState(next);
  }, [useTraditionalChinese]);

  const handleSortChange = () => {
    const newSortOrder = sortOrder === 'ascending' ? 'descending' : 'ascending';
    setSortOrder(newSortOrder);
  };

  if (!bookId) {
    return <Navigate to="/" replace />;
  }

  if (error) {
    return <Error message={error} href="/" />;
  }

  return (
    <CatalogWrapper>
      <MyHead bookInfo={bookInfo} />
      {bookInfo && (
      <BackBar>
        <SiteTitle to="/">番茄小說閱讀器</SiteTitle>
        <RightActions>
          <HomeButton />
          <IconButton
            type="button"
            title={useTraditionalChinese ? '切換為簡體中文' : '切換為繁體中文'}
            onClick={handleTraditionalChineseToggle}
            style={useTraditionalChinese ? { color: 'var(--accent-color)' } : undefined}
          >
            <Languages size={20} strokeWidth={2.5} />
          </IconButton>
          <IconButton
            type="button"
            title="重新載入目錄"
            onClick={() => loadBook(true)}
          >
            <RefreshCw size={20} strokeWidth={2.5} />
          </IconButton>
          {lastReadItemId && (
            <IconButton
              type="button"
              onClick={() => navigate(`/chapter?bookId=${bookId}&itemId=${lastReadItemId}`)}
              title="返回章節"
            >
              <Bookmark size={20} strokeWidth={2} />
            </IconButton>
          )}
        </RightActions>
      </BackBar>
      )}
      {bookInfo ? (
        <CatalogContent>
          <Info bookInfo={bookInfo} useTraditionalChinese={useTraditionalChinese} />
          {bookInfo.item_data_list && (
            <>
              <Sort sortOrder={sortOrder} onSortChange={handleSortChange} />
              <Menu sortOrder={sortOrder} itemDataList={bookInfo.item_data_list} bookId={bookId} useTraditionalChinese={useTraditionalChinese} />
            </>
          )}
        </CatalogContent>
      ) : (
        <LoadingPage onAbort={() => navigate('/')} />
      )}
    </CatalogWrapper>
  );
}

export default Catalog;
