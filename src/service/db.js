import { Dialog } from 'quasar'
import { nanoid } from 'nanoid'

const request = window.indexedDB.open('todo', 2)
let db

request.onerror = (e) => {
  console.log('indexDB错误：', e.toString())
  Dialog.create({
    title: '致命错误！',
    message: '本应用需要在您的机器上创建数据库以存储相关数据，请允许相关权限！',
    noBackdropDismiss: true,
    noEscDismiss: true,
    noRouteDismiss: true
  }).onOk(() => {
    window.location.reload()
  })
}

request.onsuccess = () => {
  db = request.result
  console.log('indexDB打开成功')
}

function createTables() {
  const tables = [
    {
      name: 'course',
      index: []
    },
    {
      name: 'courseArr',
      index: ['day']
    },
    {
      name: 'event',
      index: ['start', 'end']
    },
    {
      name: 'eventR',
      index: []
    },
    {
      name: 'plan',
      index: ['start', 'end']
    },
    {
      name: 'planR',
      index: []
    }
  ]
  for (let table of tables) {
    if (!db.objectStoreNames.contains(table.name)) {
      const objectStore = db.createObjectStore(table.name, { keyPath: '_id' })
      for (let index of table.index) {
        objectStore.createIndex(index, index, { unique: false })
      }
    }
  }
}

request.onupgradeneeded = (e) => {
  db = e.target.result
  console.log('indexDB升级')
  createTables()
}

export default {
  /*
  add(table, data) =>  {
    if (!data._id) data._id = nanoid()
    let req = db.transaction([table], 'readwrite')
      .objectStore(table)
      .add(data)
    req.onsuccess
  }
  */
  add: (table, data) => new Promise((resolve, reject) => {
    if (!data._id) data._id = nanoid()
    let req = db.transaction([table], 'readwrite')
      .objectStore(table)
      .add(data)
    req.onsuccess = resolve
    req.onerror = reject
  }),

}
