import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/proxy': 'http://localhost:8000',
      '/top-books': 'http://localhost:8000',
      '/recommend-books': 'http://localhost:8000',
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
