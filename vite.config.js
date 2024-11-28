// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://expensetrackbe-production.up.railway.app',  // Menyambungkan frontend ke backend
    },
  },
});
