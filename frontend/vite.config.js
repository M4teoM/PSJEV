import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,svg,webp}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
      manifest: {
        name: 'Parques de San Jerónimo',
        short_name: 'PSJ',
        description: 'Portal residencial y pasarela de pagos EV',
        theme_color: '#15803d',
        background_color: '#f0fdf4',
        display: 'standalone',
        start_url: '/v1-home',
        icons: [
          { src: '/img/PSJ.png', sizes: '192x192', type: 'image/png' },
          { src: '/img/PSJ.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
  server: {
    https: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
})
