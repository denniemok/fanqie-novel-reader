import { Routes, Route } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { DownloadManagerProvider } from './contexts/DownloadManager';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Chapter from './pages/Chapter';
import Comments from './pages/Comments';
import Bookshelf from './pages/Bookshelf';
import NewBook from './pages/NewBook';
import Announcements from './pages/Announcements';

function App() {
  return (
    <ThemeProvider>
    <ToastProvider>
    <DownloadManagerProvider>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/bookshelf" element={<Bookshelf />} />
      <Route path="/new-book" element={<NewBook />} />
      <Route path="/announcements" element={<Announcements />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/chapter" element={<Chapter />} />
      <Route path="/comments" element={<Comments />} />
    </Routes>
    </DownloadManagerProvider>
    </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
