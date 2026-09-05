const ts = () => Math.floor(new Date().getTime() / 1000)
const today = () => new Date(new Date().toLocaleDateString()).getTime() / 1000
const curTime = () => ts() - today()
const weekdayMap = ['日', '一', '二', '三', '四', '五', '六']

function weekStart() {
  return Number(window.localStorage.weekStart) === 0 ? 0 : 1
}

function weekdayName(day) {
  return weekdayMap[day % 7]
}

function weekStartTs(week = 1) {
  const firstWeekStart = Number(window.localStorage.orig) - (weekStart() === 0 ? 86400 : 0)
  return firstWeekStart + (week - 1) * 7 * 86400
}

function weekdayOffset(day) {
  return weekStart() === 0 ? day % 7 : day - 1
}

export default {
  ts,
  today,
  curTime,
  desc(ts, time=true) { // 将某一天的时间戳转换为描述该日期的字符串
    const dayDesc = (dDay) => {
      const map = {
        '-2': '后天',
        '-1': '明天',
        '0': '今天',
        '1': '昨天',
        '2': '前天'
      }
      if (map[dDay]) return map[dDay]
      const ba = dDay > 0 ? '前' : '后'
      dDay = Math.abs(dDay)
      if (dDay > 30) {
        const dMo = Math.floor(dDay / 30)
        return `${dMo}月${ba}`
      } else {
        return `${dDay}天${ba}`
      }
    }
    const todayTs = new Date(new Date().toLocaleDateString()).getTime() / 1000
    const dayTs = new Date(new Date(ts * 1000).toLocaleDateString()).getTime() / 1000
    const dDay = (todayTs - dayTs) / 86400
    if (Math.abs(dDay) <= 2 && time) {
      const h = Math.floor((ts - dayTs) / 3600)
      const m = Math.floor((ts - dayTs) % 3600 / 60)
      return `${dayDesc(dDay)} ${h}:${m < 10 ? '0' + m : m}`
    } else {
      return dayDesc(dDay)
    }
  },
  dateStrToTs(dateStr) { // 将形如2023-2-13或2023/2/13的日期字符串转为时间戳
    dateStr = dateStr.replace(/-/g, '/')
    return new Date(dateStr).getTime() / 1000
  },
  dateTsToObj(dateTs) { // 将某一天的时间戳转换为日期对象
    const timeObj = new Date(dateTs * 1000)
    return {
      year: timeObj.getFullYear(),
      month: timeObj.getMonth() + 1,
      day: timeObj.getDate()
    }
  },
  dateTsToStr(dateTs, sep='-', year=true) { // 将某一天的时间戳转换为日期字符串，如2023-2-13，可自定义分隔符
    const timeObj = new Date(dateTs * 1000)
    const y = timeObj.getFullYear(),
      m = timeObj.getMonth() + 1,
      d = timeObj.getDate()
    return year ? `${y}${sep}${m}${sep}${d}` : `${m}${sep}${d}`
  },
  dateTsToWeekdayStr(ts) { // 将某一天的时间戳转换为形如`第1周星期一`的字符串
    const { week, day } = this.dateTsToWeekdayObj(ts)
    return `第${week}周星期${weekdayName(day)}`
  },
  curWeek() {
    const d = today() - weekStartTs()
    return Math.floor(d / (86400 * 7)) + 1
  },
  dateTsToWeekdayObj(ts) { // 将某一天的时间戳转换为教学周星期对象
    const d = ts - weekStartTs()
    const week = Math.floor(d / (86400 * 7)) + 1
    const dateWeekday = new Date(ts * 1000).getDay()
    const day = dateWeekday === 0 ? 7 : dateWeekday
    return {
      week,
      day
    }
  },
  weekStart,
  weekStartTs,
  weekdayOffset,
  weekdayName,
  timeStrToTs(timeStr) { // 将形如08:30的时刻字符串转为时间戳
    const t = timeStr.split(':')
    return t[0] * 3600 + t[1] * 60
  },
  timeTsToStr(timeTs) { // 将某时刻的时间戳转换为字符串，如08:30
    timeTs %= 86400
    const h = Math.floor(timeTs / 3600)
    timeTs %= 3600
    const m = Math.floor(timeTs / 60)
    return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`
  },
}
