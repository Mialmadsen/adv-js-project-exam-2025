import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Improve chunking for large deps and raise warning threshold
  build: {
    chunkSizeWarningLimit: 1000, // increase to 1000kb to reduce noisy warnings
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'firebase'
            if (id.includes('@fortawesome') || id.includes('fontawesome')) return 'icons'
            if (id.includes('vue')) return 'vue-vendor'
            if (id.includes('vue-router')) return 'vue-router'
            return 'vendor'
          }
        },
      },
    },
  },
})
