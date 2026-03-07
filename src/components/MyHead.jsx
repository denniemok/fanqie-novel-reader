import React from 'react';
import { Helmet } from 'react-helmet-async';

function MyHead({ bookInfo, chapterData }) {
  const bookName = bookInfo && bookInfo.book_info && bookInfo.book_info.original_book_name;
  const bookTitle = chapterData && chapterData.novel_data && chapterData.novel_data.original_book_name;
  const author = bookInfo && bookInfo.book_info && bookInfo.book_info.author;
  const icon = bookInfo && bookInfo.book_info && bookInfo.book_info.thumb_url;
  const currentURL = typeof window !== 'undefined' ? window.location.href : '';
  const rawDesc = bookInfo?.book_info?.abstract?.replace(/\n[\u3000]+/g, ' ') ?? '';
  const description = rawDesc
    ? (rawDesc.length > 160 ? rawDesc.slice(0, 160) + '…' : rawDesc)
    : '番茄小說第三方閱讀器，輸入bookId即可閱讀。';

  const manifest = {
    name: bookName || '番茄小說閱讀器',
    short_name: bookName || '番茄小說閱讀器',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      { src: icon || '', sizes: '192x192', type: 'image/png' },
      { src: icon || '', sizes: '512x512', type: 'image/png' },
    ],
  };

  return (
    <Helmet>
      <title>{bookName || bookTitle || '番茄小說閱讀器'}</title>
      <meta name="description" content={description} />
      <meta name="author" content={author} />
      <link rel="icon" href={icon} />
      <meta name="manifest" content={`data:application/manifest+json,${JSON.stringify(manifest)}`} />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta property="og:title" content={bookName || bookTitle || '番茄小說閱讀器'} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={icon} />
      <meta property="og:url" content={currentURL} />
      <meta name="twitter:title" content={bookName || bookTitle || '番茄小說閱讀器'} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={icon} />
    </Helmet>
  );
}

export default MyHead;
