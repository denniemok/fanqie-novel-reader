import { Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Chapter from './pages/Chapter';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/chapter" element={<Chapter />} />
      </Routes>
      <Analytics debug={false} />
    </>
  );
}

export default App;
