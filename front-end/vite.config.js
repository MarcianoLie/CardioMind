import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    outDir: '../front-end/dist',
    historyApiFallback: true,  // Pastikan ini aktif
  },
})
