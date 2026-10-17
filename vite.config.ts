import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The web app lives in web/; in development Vite proxies API and media requests to the Node server.
export default defineConfig({
  root: 'web',
  plugins: [react()],
  build: { outDir: 'dist', emptyOutDir: true },
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:4600', '/media': 'http://localhost:4600', '/assets-repo': 'http://localhost:4600' },
  },
});
