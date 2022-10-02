export function stringifyTime(ts) {
  ts %= 86400 * 1000
  ts /= 1000
  const h = Math.floor(ts / 3600)
  ts %= 3600
  const m = Math.floor(ts / 60)
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`
}

export function numberifyTime(str) {
  const res = str.split(':')
  return (res[0] * 3600 + res[1] * 60) * 1000
}
