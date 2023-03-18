export default () => {
  const LS = window.localStorage
  if (LS.orig) return
  LS.orig = '1676217600'
  LS.hour = '[[28800,31500],[31800,34500],[35400,38100],[38400,41100],[41400,44100],[50400,53100],[53400,56100],[57000,59700],[60000,62700],[66600,69300],[69600,72300],[72600,75300]]'
  LS.course = '[]'
  LS.arr = '[]'
  window.location.reload()
}
