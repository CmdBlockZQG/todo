import db from './db.js'
import { numberifyTime } from './utils.js'
import { Notify } from 'quasar'

export default {
  明天全员核酸: async () => {
    await db.putOne('event', {
      name: '全员核酸',
      remark: '文体中心小广场',
      day: new Date(new Date().toLocaleDateString()).getTime() + 86400000,
      start: numberifyTime('9:30'),
      end: numberifyTime('16:30'),
      autoDel: false
    })

    Notify.create('已创建明天全员核酸的事项')
  },
  明天一号床核酸: async () => {
    await db.putOne('event', {
      name: '一号床核酸',
      remark: '水韵餐厅',
      day: new Date(new Date().toLocaleDateString()).getTime() + 86400000,
      start: numberifyTime('9:30'),
      end: numberifyTime('16:30'),
      autoDel: false
    })

    Notify.create('已创建明天一号床核酸的事项')
  }
}
