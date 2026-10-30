import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  root: 'public',
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:3005' }, // запити до твого Node-сервера
  },
});
