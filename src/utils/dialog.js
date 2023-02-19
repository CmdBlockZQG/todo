import { h, createApp } from 'vue'

import mainApp from '../main.js'

import Dialog from '../components/Dialog.vue'

export default (title, text, onOk=() => {}, onCancel=() => {}) => {
  const container = document.createElement('div')
  document.body.appendChild(container)

  const app = createApp({
    name: 'globalDialog',
    setup: () => () => h(Dialog, {
      title: title,
      text: text,
      onOk: () => { onOk(); destroy() },
      onCancel: () => { onCancel(); destroy() }
    })
  })

  app.config.globalProperties = mainApp.config.globalProperties

  const { reload, ...appContext } = mainApp._context
  Object.assign(app._context, appContext)

  app.mount(container)

  
  function destroy() {
    app.unmount(container)
    container.remove()
  }
}