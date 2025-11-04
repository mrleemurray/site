import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  base: '/', // Use root path for both dev and production
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/tokens.scss" as *;`
      }
    }
  }
}))