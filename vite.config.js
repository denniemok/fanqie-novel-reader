import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '番茄繁體閱讀',
        short_name: 'FanqieTC',
        theme_color: '#ff9800',
        background_color: '#121212',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icon_192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon_512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
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
