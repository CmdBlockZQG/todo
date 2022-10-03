import db from './db.js'
import setting from './setting.js'

export async function dailyUpdate() {
  const lastUpdateTs = await setting.get('lastUpdate')
  const todayTs = new Date(new Date().toLocaleDateString()).getTime()
  if (lastUpdateTs === todayTs) return

  const now = new Date()
  const today = new Date(todayTs)
  const termStart = new Date(await setting.get('termStart'))
  const week = 1 + Math.floor((today.getTime() - termStart.getTime()) / (7 * 86400 * 1000))
  const day = now.getDay() ? now.getDay() : 7

  const eventR = await db.getAll('eventR')

  let res = []
  for (let ts = lastUpdateTs + 86400 * 1000; ts <= todayTs; ts += 86400 * 1000) {
    res = res.concat(await arrangeEvent(eventR, ts, week, day))
  }
  await db.comOp({}, { 'event': res })
  await setting.set('lastUpdate', todayTs)
}

export async function arrangeEvent(eventR, dayTs, week, day) {
  if (!eventR) eventR = await db.getAll('eventR')
  let res = []
  const addToRes = (e, p) => {
    res.push({
      name: e.name,
      remark: e.remark,
      day: dayTs,
      autoDel: e.autoDel,
      start: e.plan[p][0] % 86400000,
      end: e.plan[p][1] % 86400000
    })
  }
  for (const e of eventR) {
    let loopStart
    switch (e.type) {
      case('d'):
        loopStart = dayTs
        break
      case('w'):
        loopStart = dayTs - (day - 1) * 86400000
        break
      case('xd'):
        if (e.startDay < dayTs) continue
        let tmp = Math.floor((dayTs - e.startDay) / (e.cycle * 86400 * 1000))
        loopStart = e.startDay + tmp * e.cycle * 86400 * 1000
        break
      case('m'):
        loopStart = dayTs - (new Date(dayTs).getDate() - 1) * 86400000
        break
      case('ow'):
        if (week % 2 === 1) loopStart = dayTs - (day - 1) * 86400000
        else loopStart = dayTs - 86400 * 1000 * 7 - (day - 1) * 86400000
        break
      case('ew'):
        if (week % 2 === 0) loopStart = dayTs - (day - 1) * 86400000
        else loopStart = dayTs - 86400 * 1000 * 7 - (day - 1) * 86400000
        break
    }
    for (let p = 0; p < e.plan.length; ++p) {
      const s = loopStart + e.plan[p][0]
      if (s >= dayTs && s < dayTs + 86400 * 1000) addToRes(e, p)
    }
  }
  return res
}
