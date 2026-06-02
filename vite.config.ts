import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      ignored: [
        '**/TShock/**',
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**'
      ],
      usePolling: false
    },
    proxy: {
      '/api': {
        target: 'http://localhost:7878',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        codeSplitting: true
      }
    }
  }
})
