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
  }
}