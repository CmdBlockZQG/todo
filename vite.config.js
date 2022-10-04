import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'AlTodo',
        short_name: 'AlTodo',
        description: '一个自制的Todo应用',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        lang: 'zh-CN',
        display: 'standalone',
        icons: [
          {
            src: 'icons/32x32.png',
            sizes: '32x32',
            type: 'image/png'
          },
          {
            src: 'icons/70x70.png',
            sizes: '70x70',
            type: 'image/png'
          },
          {
            src: 'icons/144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'icons/150x150.png',
            sizes: '150x150',
            type: 'image/png'
          },
          {
            src: 'icons/192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/150x150.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
