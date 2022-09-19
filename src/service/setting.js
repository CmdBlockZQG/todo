import db from './db.js'

export default {
  async get(key) {
    const res = await db.getOne('setting', key)
    return res.value
  },
  async set(key, value) {
    await db.putOne('setting', { _id: key, value: value })
  }
}
