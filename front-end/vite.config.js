import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Gunakan '/' untuk root domain (subdomain Railway)
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});