import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Gunakan '/' untuk root domain (subdomain Railway)
  server: {
    host: true, // Penting untuk Railway
    port: process.env.PORT || 3000,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  preview: {
    port: process.env.PORT || 3000,
  }
});