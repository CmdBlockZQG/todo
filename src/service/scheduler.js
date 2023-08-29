import time from '../utils/time'

const LS = window.localStorage

function plans(date) {
  const planIdList = JSON.parse(LS.plan)
  const res = []
  for (let planId of planIdList) {
    const plan = JSON.parse(LS[planId])
    if (plan.date === date) {
      res.push(plan)
    }
  }
  return res.sort((x, y) => x.end === y.end ? x.start - y.start : x.end - y.end)
}

function events(date) {
  const eventIdList = JSON.parse(LS.event)
  const res = []
  for (let eventId of eventIdList) {
    const event = JSON.parse(LS[eventId])
    if (event.date >= date) {
      res.push(event)
    }
  }
  return res.sort((x, y) => x.time - y.time)
}

function routines(date) {
  const wd = time.dateTsToWeekdayObj(date)
  const dateObj = time.dateTsToObj(date)
  const routineIdList = JSON.parse(LS.routine)
  const res = []
  let loopStart
  for (let routineId of routineIdList) {
    const routine = JSON.parse(LS[routineId])
    switch (routine.type) {
      case 'w':
        loopStart = date - (wd.day - 1) * 86400
        break
      case 'm':
        loopStart = date - (dateObj.day - 1) * 86400
        break
      case 'xd':
        if (date < routine.startDate) continue
        const tmp = Math.floor((date - routine.startDate) / (routine.len * 86400))
        loopStart = routine.startDate + tmp * routine.len * 86400
        break
      case 'ow':
        if (wd.week % 2 === 1) loopStart = date - (wd.day - 1) * 86400
        else loopStart = date - 7 * 86400 - (wd.day - 1) * 86400
        break
      case 'ew':
        if (wd.week % 2 === 0) loopStart = date - (wd.day - 1) * 86400
        else loopStart = date - 7 * 86400 - (wd.day - 1) * 86400
        break
    }
    const nowSt = (date - loopStart) / 86400 + 1
    for (const arr of routine.arr) {
      if (arr.day === nowSt) {
        res.push({
          title: routine.title,
          content: routine.content,
          start: arr.start,
          end: arr.end,
          remark: arr.remark
        })
      }
    }
  }
  return res.sort((x, y) => x.end === y.end ? x.start - y.start : x.end - y.end)
}

function courses(date) {
  const wd = time.dateTsToWeekdayObj(date)
  const arrIdList = JSON.parse(LS.arr)
  const res = []
  for (let arrId of arrIdList) {
    const arr = JSON.parse(LS[arrId])
    if (arr.day === wd.day && arr.week.indexOf(wd.week) !== -1) {
      arr.course = JSON.parse(LS[arr.courseId])
      res.push(arr)
    }
  }
  return res.sort((x, y) => (x.hour[0] === y.hour[0]) ? x.hour[1] - y.hour[1] : x.hour[0] - y.hour[0])
}

export default {
  plans,
  events,
  routines,
  courses
}
