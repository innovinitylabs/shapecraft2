import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    host: true
  },
  css: {
    postcss: false // Disable PostCSS to avoid conflicts
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
