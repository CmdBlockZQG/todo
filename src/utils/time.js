export default {
  ts: () => Math.floor(new Date().getTime() / 1000),
  desc(ts) {
    const dayDesc = (dDay) => {
      const map = {
        '-2': '后天',
        '-1': '明天',
        '0': '今天',
        '1': '昨天',
        '2': '前天'
      }
      if (map[dDay]) return map[dDay]
      if (dDay > 0) return `${dDay}天前`
      return `${-dDay}天后`
    }
    const todayTs = new Date(new Date().toLocaleDateString()).getTime() / 1000
    const dayTs = new Date(new Date(ts * 1000).toLocaleDateString()).getTime() / 1000
    const dDay = (todayTs - dayTs) / 86400
    const h = Math.floor((ts - dayTs) / 3600)
    const m = Math.floor((ts - dayTs) % 3600 / 60)
    return `${dayDesc(dDay)} ${h}:${m < 10 ? '0' + m : m}`
  },
  dateStrToTs(dateStr) { // 将形如2023-2-13或2023/2/13的日期字符串转为时间戳
    return new Date(dateStr).getTime() / 1000
  },
  dateTsToStr(dateTs, sep='-') { // 将某一天的时间戳转换为日期字符串，如2023-2-13，可自定义分隔符
    const timeObj = new Date(dateTs * 1000)
    const y = timeObj.getFullYear(),
      m = timeObj.getMonth() + 1,
      d = timeObj.getDate()
    return `${y}${sep}${m}${sep}${d}`
  },
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
