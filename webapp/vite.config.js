import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5174,
    host: '0.0.0.0'
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      includeAssets: ['logoFundo.svg', 'logo.png', 'logo.svg', 'icon-*-bg.png'],
      manifest: {
        name: 'BusHere! - Rastreamento de Ônibus',
        short_name: 'BusHere!',
        description: 'Aplicativo para rastreamento em tempo real de ônibus e transporte público',
        theme_color: '#21d401ff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        categories: ['navigation', 'travel', 'utilities'],
        lang: 'pt-BR',
        icons: [
          {
            src: 'icon-72-bg.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-96-bg.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-128-bg.png',
            sizes: '128x128',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-144-bg.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-152-bg.png',
            sizes: '152x152',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-192-bg.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-192-bg.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: 'icon-384-bg.png',
            sizes: '384x384',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-512-bg.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-512-bg.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ]
})
