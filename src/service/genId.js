const seqMax = 1 << 12
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
  return ((BigInt(ts) << 12n) + BigInt(seq)).toString(36)
}
