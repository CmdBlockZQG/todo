import genId from '../service/genId.js'
import db from './db.js'

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

  await db.comAdd({
    course: [course],
    courseArr: arr
  })
}

export async function getCourses() {
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
