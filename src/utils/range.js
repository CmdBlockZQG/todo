export default {
  stringify(lis) { // 将数组转换为序列字符串
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
  },
  parse(str) { // 将序列字符串（如3,4-5,6）转换为数组
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
  },
  pair(str) {
    const arr = str.split('-')
    const s = Number(arr[0]), t = Number(arr[1])
    if (isNaN(s) || isNaN(t)) return [0, 0]
    else return [s, t]
  }
}
