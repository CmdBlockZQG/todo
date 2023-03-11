import { createApp } from 'vue'

import router from './router.js'
import App from './App.vue'
import initLS from './service/initLS.js'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

initLS()

const app = createApp(App)
app.use(router)
app.use(createVuetify({
  theme: {
    defaultTheme: 'blue',
    themes: {
      blue: {
        dark: false,
        colors: {
          background: '#FFFFFF',
          surface: '#FFFFFF',
          primary: '#2979FF',
          secondary: '#0091EA',
          error: '#B00020',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
        }
      }
    }
  }
}))
app.mount('#app')

export default app
