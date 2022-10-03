import db from './db.js'

const tables = ['course', 'courseArr', 'event', 'eventR', 'plan', 'setting']

export default {
  async genBackup() {
    let res = {}
    for (const table of tables) {
      res[table] = await db.getAll(table)
    }
    return JSON.stringify(res)
  },
  async impBackup(json) {
    const data = JSON.parse(json)
    await db.clearTables(Object.keys(data))
    await db.comOp({}, data)
  }
}
