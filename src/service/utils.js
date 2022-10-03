export function stringifyTime(ts) {
  ts %= 86400 * 1000
  ts /= 1000
  const h = Math.floor(ts / 3600)
  ts %= 3600
  const m = Math.floor(ts / 60)
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`
}

export function stringifyTimeAP(ts) {
  ts %= 86400 * 1000
  ts /= 1000
  const h = Math.floor(ts / 3600)
  ts %= 3600
  const m = Math.floor(ts / 60)
  // 对我来说，下午一点以前都是上午
  return `${h > 12 ? 'P' : 'A'}${h > 12 ? h - 12 : h}:${m < 10 ? '0' + m : m}`
}

export function stringifyTimeSEAP(ts1, ts2) {
  const s1 = stringifyTimeAP(ts1),
        s2 = stringifyTimeAP(ts2)
  if (s1[0] === s2[0]) {
    return `${s1[0]}${s1.substring(1)}—${s2.substring(1)}`
  } else {
    return `${s1} — ${s2}`
  }
}

export function numberifyTime(str) {
  const res = str.split(':')
  return (res[0] * 3600 + res[1] * 60) * 1000
}
