import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/*.woff', 'assets/*.woff2', 'assets/*.ttf', 'assets/*.eot'],
      manifest: {
        name: 'AlTodo',
        short_name: 'AlTodo',
        description: '一款为（一个）大学生设计的课表、事项管理软件',
        theme_color: '#2979FF',
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
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
})
