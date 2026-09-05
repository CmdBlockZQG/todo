export default () => {
  const LS = window.localStorage
  if (!LS.orig) {
    LS.orig = '1788105600'
    // LS.hour = '[[28800,31500],[31800,34500],[35400,38100],[38400,41100],[41400,44100],[50400,53100],[53400,56100],[57000,59700],[60000,62700],[66600,69300],[69600,72300],[72600,75300]]'
    LS.hour = '[[28200,30900],[31200,33900],[35100,37800],[38100,40800],[41100,43800],[50400,53100],[53400,56100],[57300,60000],[60300,63000],[63300,66000],[70200,72900],[73200,75900],[76200,78900]]'
    // LS.period = '[[1,2],[3,5],[6,7],[8,9],[10,12]]'
    LS.period = '[[1,2],[3,5],[6,7],[8,10],[11,13]]'
    LS.course = '[]'
    LS.arr = '[]'
    LS.work = '[]'
    LS.plan = '[]'
    LS.event = '[]'
    LS.routine = '[]'
    LS.weekStart = '1'
    window.location.reload()
    return
  }

  // Existing installations use Monday as the first day of the week.
  if (LS.weekStart !== '0' && LS.weekStart !== '1') LS.weekStart = '1'
}
