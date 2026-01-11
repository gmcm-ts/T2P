import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  root: '.',
  build: {
    outDir: 'dist',
    copyPublicDir: true
  },
  publicDir: false
})