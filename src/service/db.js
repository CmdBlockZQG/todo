import { Dialog } from 'quasar'
import genId from './genId.js'

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
  raw: db,
  // 向一张表中加入一个文档
  addOne: (table, data) => new Promise((resolve, reject) => {
    if (!data._id) data._id = genId()
    const req = db.transaction([table], 'readwrite')
      .objectStore(table)
      .add(data)
    req.onsuccess = resolve
    req.onerror = reject
  }),
  // 向多张表中加入多个文档
  comAdd: (data) => new Promise((resolve, reject) => {
    // data { table1: [doc1, doc2], table2: [doc3, doc4] }
    console.log(data)
    const tables = Object.keys(data)
    const transaction = db.transaction(tables, 'readwrite')
    for (let table of tables) {
      const objectStore = transaction.objectStore(table)
      for (let doc of data[table]) {
        if (!doc._id) doc._id = genId()
        objectStore.add(doc)
      }
    }
    transaction.oncomplete = resolve
    transaction.onerror = reject
  }),
  getAll: (table) => new Promise((resolve, reject) => {
    const objectStore = db.transaction([table], 'readonly').objectStore(table)
    const res = []
    const req = objectStore.openCursor()
    req.onsuccess = (e) => {
      const cursor = e.target.result
      if (cursor) {
        res.push(cursor.value)
        cursor.continue()
      } else {
        resolve(res)
      }
    }
    req.onerror = reject
  })
}

