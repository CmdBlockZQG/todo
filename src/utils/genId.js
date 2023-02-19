const seqMax = 1 << 15
let seq = 0
let ts = 0

const timeStamp = () => Date.now() - 1577808000000

export default () => {
  let now = timeStamp()
  if (ts === now) {
    if (++seq === seqMax) {
      while (now <= ts) {
        now = timeStamp()
      }
      seq = 0
    }
  } else {
    seq = 0
  }
  ts = now
  let seqStr = seq.toString(36)
  while (seqStr.length < 3) {
    seqStr = '0' + seqStr
  }
  let tsStr = ts.toString(36)
  while (tsStr.length < 9) {
    tsStr = '0' + tsStr
  }
  return tsStr + seqStr
}
