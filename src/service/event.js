import db from './db.js'

export async function getTodayEvents(dayTs) {
  return await db.getEventByDayRange(IDBKeyRange.only(dayTs))
}

export async function getExpiredEvents(dayTs) {
  return await db.getEventByDayRange(IDBKeyRange.upperBound(dayTs, true))
}

export async function getFutureEvents(dayTs) {
  return await db.getEventByDayRange(IDBKeyRange.lowerBound(dayTs + 86400 * 1000, false))
}
