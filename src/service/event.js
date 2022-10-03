import db from './db.js'

export async function getTodayEvents(dayTs) {
  let res = await db.getEventByDayRange(IDBKeyRange.only(dayTs))
  res.sort((a, b) => a.end === b.end ? a.start - b.start : a.end - b.end)
  return res
}

export async function getExpiredEvents(dayTs) {
  let all = await db.getEventByDayRange(IDBKeyRange.upperBound(dayTs, true))
  let res = []
  for (let i = 0; i < all.length; ++i) {
    if (all[i].autoDel) {
      await db.delOne('event', all[i]._id)
    } else {
      res.push(all[i])
    }
  }
  res.sort((a, b) => a.end === b.end ? a.start - b.start : a.end - b.end)
  return res
}

export async function getFutureEvents(dayTs) {
  let res = await db.getEventByDayRange(IDBKeyRange.lowerBound(dayTs + 86400 * 1000, false))
  res.sort((a, b) => a.end === b.end ? a.start - b.start : a.end - b.end)
  return res
}
