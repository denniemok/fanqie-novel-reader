import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { UiFontProvider } from './contexts/UiFontContext';
import { BookDisplayVariantProvider } from './contexts/BookDisplayVariantContext';
import { BookshelfQuickActionProvider } from './contexts/BookshelfQuickActionContext';
import { ConversionModeProvider } from './contexts/ConversionModeContext';
import { DownloadManagerProvider } from './contexts/DownloadManager';
import { ROUTES, buildDefaultDiscoverUrl } from './utils/navigation';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Chapter from './pages/Chapter';
import Comments from './pages/Comments';
import Bookshelf from './pages/Bookshelf';
import Discover from './pages/Discover';
import Announcements from './pages/Announcements';
import Download from './pages/Download';
import Status from './pages/Status';
import Export from './pages/Export';
import Import from './pages/Import';
import Terms from './pages/Terms';

function DiscoverRootRedirect() {
  return <Navigate to={buildDefaultDiscoverUrl()} replace />;
}

function App() {
  return (
    <ThemeProvider>
      <UiFontProvider>
        <ConversionModeProvider>
          <BookDisplayVariantProvider>
            <BookshelfQuickActionProvider>
              <ToastProvider>
                <DownloadManagerProvider>
                  <Routes>
                    <Route path={ROUTES.home} element={<Home />} />
                    <Route path={ROUTES.bookshelf} element={<Bookshelf />} />
                    <Route path={ROUTES.discover} element={<DiscoverRootRedirect />} />
                    <Route path={`${ROUTES.discover}/:tab/:section?`} element={<Discover />} />
                    <Route path={ROUTES.announcements} element={<Announcements />} />
                    <Route path={ROUTES.download} element={<Download />} />
                    <Route path={ROUTES.status} element={<Status />} />
                    <Route path={ROUTES.catalog} element={<Catalog />} />
                    <Route path={ROUTES.chapter} element={<Chapter />} />
                    <Route path={ROUTES.comments} element={<Comments />} />
                    <Route path={ROUTES.export} element={<Export />} />
                    <Route path={ROUTES.import} element={<Import />} />
                    <Route path={ROUTES.terms} element={<Terms />} />
                    <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
                  </Routes>
                </DownloadManagerProvider>
              </ToastProvider>
            </BookshelfQuickActionProvider>
          </BookDisplayVariantProvider>
        </ConversionModeProvider>
      </UiFontProvider>
    </ThemeProvider>
  );
}

export default App;
