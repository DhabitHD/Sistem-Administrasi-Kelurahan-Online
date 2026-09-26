import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        /* Split rarely-changing vendor code from app code. Without this, editing
           one news item invalidates the whole bundle for returning visitors.
           Rolldown (Vite 8) requires a function, not a map. */
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (/node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'react';
          if (/node_modules[\\/]bootstrap[\\/]/.test(id)) return 'bootstrap';
          if (/node_modules[\\/](lottie-web|lottie-react)[\\/]/.test(id)) return 'motion';
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:8000',
      /* Uploaded files (KTP, avatars, complaint evidence) are served by the
         backend from /storage/uploads/*. Without this the browser asks the Vite dev
         server for them, gets a 404, and every avatar silently disappears. */
      '/storage': 'http://127.0.0.1:8000',
    },
  },
});
