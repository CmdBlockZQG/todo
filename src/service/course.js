import genId from '../service/genId.js'
import db from './db.js'
import setting from './setting.js'

function dumpList(str) {
  const res = []
  for (let i of str.split(',')) {
    let g = i.split('-')
    if (g.length === 1) {
      let t = Number(g[0])
      if (!isNaN(t)) res.push(t)
    } else if (g.length === 2) {
      let s = Number(g[0]),
        t = Number(g[1])
      if (isNaN(s) || isNaN(t)) continue
      for (let j = s; j <= t; ++j) res.push(j)
    }
  }
  return res.sort((x, y) => x - y)
}

function dumpRange(str) {
  const arr = str.split('-')
  const s = Number(arr[0]), t = Number(arr[1])
  if (isNaN(s) || isNaN(t)) return [0, 0]
  else return [s, t]
}

export function stringifyLis(lis) {
  if (lis.length === 0) return ''
  lis = lis.sort((x, y) => x - y)
  let res = []
  let l = 0
  for (let i = 1; i < lis.length; ++i) {
    if (lis[i] === lis[i - 1] + 1) continue
    if (i === l + 1) res.push(lis[l])
    else res.push(`${lis[l]}-${lis[i - 1]}`)
    l = i
  }
  if (l + 1 === lis.length) res.push(lis[l])
  else res.push(`${lis[l]}-${lis[lis.length - 1]}`)
  return res.join(',')
}

export async function addCourse(basic, arrRaw) {
  const course = {
    _id: genId(),
    id: basic.id,
    name: basic.name,
    remark: basic.remark,
    arr: []
  }
  const arr = []
  for (let i of arrRaw) {
    const day = Number(i.day)
    if (isNaN(day) || day < 1 || day > 7 ) continue
    const cur = {
      _id: genId(),
      course_id: course._id,
      week: dumpList(i.week),
      day: day,
      hour: dumpRange(i.hour),
      place: i.place
    }
    arr.push(cur)
    course.arr.push(cur._id)
  }

  await db.comOp({}, {
    course: [course],
    courseArr: arr
  })
}

export async function updateCourse(basic, arrRaw) {
  // 注意：course中的arr是修改前的 策略是把以前的全部删掉，重新加入新的！
  const course = {
    _id: basic._id,
    id: basic.id,
    name: basic.name,
    remark: basic.remark,
    arr: []
  }
  const arr = []
  for (let i of arrRaw) {
    const day = Number(i.day)
    if (isNaN(day) || day < 1 || day > 7 ) continue
    const cur = {
      _id: i._id,
      course_id: course._id,
      week: dumpList(i.week),
      day: day,
      hour: dumpRange(i.hour),
      place: i.place
    }
    arr.push(cur)
    course.arr.push(cur._id)
  }

  await db.comOp({
    courseArr: basic.arr
  }, {
    course: [course],
    courseArr: arr
  })
}

export async function getCourseRaw(_id) {
  const course = await db.getOne('course', _id)
  const arr = await db.getMany('courseArr', course.arr)
  for (const i of arr) {
    i.hour = i.hour.join('-')
    i.week = stringifyLis(i.week)
  }
  return {
    course: course,
    courseArr: arr
  }
}

export async function getAllCourses() {
  const dic = {}
  for (const arr of await db.getAll('courseArr')) {
    if (dic[arr.course_id]) dic[arr.course_id].push(arr)
    else dic[arr.course_id] = [arr]
  }
  const res = []
  for (const course of await db.getAll('course')) {
    course.arr = dic[course._id]
    res.push(course)
  }
  return res
}

export async function clearCourses() {
  await db.clearTables(['course', 'courseArr'])
}

export async function delCourse(_id) {
  const course = await db.getOne('course' , _id)
  await db.comOp({
    course: [_id],
    courseArr: course.arr
  }, {})
}

export async function getCourses(week, day) {
  const arrs = await db.getCourseArrByDay(day)
  const course = {}
  const res = []
  for (const arr of arrs) {
    if (arr.week.indexOf(week) === -1) continue
    if (!course[arr.course_id]) course[arr.course_id] = await db.getOne('course', arr.course_id)
    res.push({
      course_id: arr.course_id,
      arr_id: arr._id,
      id: course[arr.course_id].id,
      name: course[arr.course_id].name,
      remark: course[arr.course_id].remark,
      hour: arr.hour,
      place: arr.place
    })
  }
  const periodsRaw = await setting.get('period')
  let period = {}, periods = {}
  for (let i = 0; i < periodsRaw.length; ++i) {
    periods[i] = true
    for (let j = periodsRaw[i][0]; j <= periodsRaw[i][1]; ++j) {
      period[j] = i
    }
  }
  for (const c of res) {
    for (let j = c.hour[0]; j <= c.hour[1]; ++j){
      delete periods[period[j]]
    }
  }
  for (const p of Object.keys(periods)) {
    res.push({
      hour: periodsRaw[p]
    })
  }
  res.sort((a, b) => a.hour[0] - b.hour[0])
  return res
}
