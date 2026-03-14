import { fetchBookDirectory, fetchBookDetail } from '../services/api';

export async function fetchBookDetailAndDirectory(bookId, { forceRefresh = false, catalogOnly = false, signal } = {}) {
  const refreshDirectory = forceRefresh;
  const refreshDetail = forceRefresh && !catalogOnly;
  const [bookRes, detail] = await Promise.all([
    fetchBookDirectory(bookId, { forceRefresh: refreshDirectory, signal }),
    fetchBookDetail(bookId, { forceRefresh: refreshDetail, signal }).catch((err) => {
      console.error('獲取書籍詳情失敗:', bookId, err);
      return {};
    })
  ]);
  
  const bookData = bookRes.data.data.data;
  return {
    ...bookData,
    book_info: { ...bookData.book_info, ...detail },
  };
}
