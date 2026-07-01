import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const API_TARGET = 'http://localhost:8000';

/** Let browser navigations (refresh) serve the SPA; only proxy API fetches. */
function apiProxy() {
  return {
    target: API_TARGET,
    bypass(req) {
      if (req.headers.accept?.includes('text/html')) {
        return '/index.html';
      }
    },
  };
}

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/proxy': API_TARGET,
      '/recommend-books': API_TARGET,
      '/homepage-books': API_TARGET,
      '/rank-books': API_TARGET,
      '/api-status': API_TARGET,
      '/announcements': apiProxy(),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['styled-components', 'lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
