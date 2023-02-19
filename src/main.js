import { createApp } from 'vue'

import router from './router.js'
import App from './App.vue'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const app = createApp(App)
app.use(router)
app.use(createVuetify())
app.mount('#app')

export default app