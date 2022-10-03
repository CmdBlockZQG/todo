import { createApp } from 'vue'
import { Quasar, Dialog, Notify } from 'quasar'

import router from './router.js'
import App from './App.vue'

import lang from 'quasar/lang/zh-CN'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'

import './service/db.js'

const app = createApp(App)
app.use(router)
app.use(Quasar, {
  lang: lang,
  plugins: {
    Dialog,
    Notify
  }
})
app.mount('#app')
