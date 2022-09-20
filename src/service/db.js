import { Dialog } from 'quasar'
import genId from './genId.js'

const request = window.indexedDB.open('todo', 6)
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

request.onsuccess = async () => {
  db = request.result
  console.log('indexDB打开成功')
  console.log()
  try {
    await api.getOne('setting', 'termStart')
  } catch (e) {
    await api.comOp({}, {
      setting: [
        { _id: 'termStart', value: 1661702400000 },
        { _id: 'hour', value: [[28800000,31500000],[31800000,34500000],[35400000,38100000],[38400000,41100000],[41400000,44100000],[50400000,53100000],[53400000,56100000],[57000000,59700000],[60000000,62700000],[66600000,69300000],[69600000,72300000],[72600000,75300000]] }
      ]
    })
  }
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
    },
    {
      name: 'setting',
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

request.onupgradeneeded = async (e) => {
  db = e.target.result
  console.log('indexDB升级')
  createTables()
}

function unionArray(x, y) {
  return Array.from(new Set(x.concat(y)))
}

const api = {
  raw: db,
  // 向一张表中加入一个文档
  putOne: (table, data) => new Promise((resolve, reject) => {
    if (!data._id) data._id = genId()
    const req = db.transaction([table], 'readwrite')
      .objectStore(table)
      .put(data)
    req.onsuccess = resolve
    req.onerror = reject
  }),
  /*
  聚合操作 先删后加
  del { table1: [_id1, _id2], table2: [_id] }
  put { table1: [doc1, doc2], table2: [doc3, doc4] }
   */
  comOp: (del, put) => new Promise((resolve, reject) => {
    const tables = unionArray(Object.keys(del), Object.keys(put))
    const transaction = db.transaction(tables, 'readwrite')
    for (let table of Object.keys(del)) {
      const objectStore = transaction.objectStore(table)
      for (let doc of del[table]) {
        objectStore.delete(doc)
      }
    }
    for (let table of Object.keys(put)) {
      const objectStore = transaction.objectStore(table)
      for (let doc of put[table]) {
        if (!doc._id) doc._id = genId()
        objectStore.put(doc)
      }
    }
    transaction.oncomplete = resolve
    transaction.onerror = reject
  }),
  // 读取一张表中的全部文档
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
  }),
  // 读取一个文档
  getOne: (table, _id) => new Promise((resolve, reject) => {
    const req = db.transaction([table]).objectStore(table).get(_id)
    req.onerror = reject
    req.onsuccess = (e) => {
      const res = req.result
      if (res) resolve(res)
      else reject(e)
    }
  }),
  // 读取一些文档, lis是_id列表
  getMany: (table, lis) => new Promise((resolve, reject) => {
    const transaction = db.transaction([table])
    const objectStore = transaction.objectStore(table)
    const res = []
    for (const _id of lis) {
      const req = objectStore.get(_id)
      req.onsuccess = (e) => {
        if (req.result) res.push(req.result)
        else reject(e)
        if (res.length === lis.length) resolve(res)
      }
    }
    transaction.onerror = reject
  }),
  // 删除多个表中的全部内容 tables ['tableName1', 'tableName2']
  clearTables: (tables) => new Promise((resolve, reject) => {
    const transaction = db.transaction(tables, 'readwrite')
    for (let table of tables) {
      transaction.objectStore(table).clear()
    }
    transaction.oncomplete = resolve
    transaction.onerror = reject
  }),
  // 根据星期几读取课程安排，即courseArr
  getCourseArrByDay: (day) => new Promise((resolve, reject) => {
    const index = db.transaction(['courseArr'], 'readonly').objectStore('courseArr').index('day')
    const req = index.openCursor(IDBKeyRange.only(day))
    const res = []
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

export default api
