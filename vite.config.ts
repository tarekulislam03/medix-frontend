import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'axios', 'clsx', 'tailwind-merge', 'react-hot-toast'],
          charts: ['recharts'],
          icons: ['@heroicons/react'],
          ui: ['@headlessui/react', 'framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },

  server: {
    host: true,                 // ✅ allow external access
    allowedHosts: true,        // ✅ fix ngrok blocked error
    port: 5173,

    proxy: {
      '/api': {
        target: 'https://medix-bend.vercel.app',
        changeOrigin: true,
      },
    },
  },
})
