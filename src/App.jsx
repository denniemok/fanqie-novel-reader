import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DownloadManagerProvider } from './contexts/DownloadManager';
import { ROUTES } from './utils/navigation';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Chapter from './pages/Chapter';
import Comments from './pages/Comments';
import Bookshelf from './pages/Bookshelf';
import NewBook from './pages/NewBook';
import Announcements from './pages/Announcements';
import Download from './pages/Download';
import Status from './pages/Status';
import Export from './pages/Export';
import Import from './pages/Import';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <DownloadManagerProvider>
          <Routes>
            <Route path={ROUTES.home} element={<Home />} />
            <Route path={ROUTES.bookshelf} element={<Bookshelf />} />
            <Route path={ROUTES.newBook} element={<NewBook />} />
            <Route path={ROUTES.announcements} element={<Announcements />} />
            <Route path={ROUTES.download} element={<Download />} />
            <Route path={ROUTES.status} element={<Status />} />
            <Route path={ROUTES.catalog} element={<Catalog />} />
            <Route path={ROUTES.chapter} element={<Chapter />} />
            <Route path={ROUTES.comments} element={<Comments />} />
            <Route path={ROUTES.export} element={<Export />} />
            <Route path={ROUTES.import} element={<Import />} />
          </Routes>
        </DownloadManagerProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
