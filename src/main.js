import { createApp } from 'vue'

import router from './router.js'
import App from './App.vue'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import colors from 'vuetify/lib/util/colors.mjs'
import { createVuetify } from 'vuetify'

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
          'primary-darken-1': '#0D47A1',
          secondary: '#0091EA',
          'secondary-darken-1': '#01579B',
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