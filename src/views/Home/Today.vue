<template>
  <v-app-bar density="compact">
    <v-app-bar-title>
      {{ time.dateTsToStr(today, '-', false) }}
      {{ time.dateTsToWeekdayStr(today) }}
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn stacked v-if="expiredCount" @click="router.push('/plan')">
        <v-badge
          color="error"
          :content="expiredCount"
          content="10"
        >
          <v-icon icon="mdi-timer-alert-outline"></v-icon>
        </v-badge>
      </v-btn>
      <v-btn icon="mdi-calendar-month-outline" @click="router.push('/preview')"></v-btn>
    </template>
  </v-app-bar>
  <v-main>
    <div class="overflow-hidden bg-grey-lighten-3 h-100 pb-6">
      <!--事项-->
      <v-sheet
        class="mt-2 pa-3 d-flex"
        v-for="plan in plans"
        :class="plan.status"
      >
        <div style="width: 70%">
          <div class="text-h5">{{ plan.title }}</div>
          <div>
            {{ plan.content }}
            <template v-if="plan.remark"><br>{{ plan.remark }}</template>
          </div>
        </div>
        <div v-if="plan.statusDesc" class="text-center d-flex flex-column justify-center" style="width: 30%">
          <div class="text-caption d-flex align-center justify-center">
            <v-icon icon="mdi-clock-outline"></v-icon>
            <div class="ml-1 text-body-2">
              {{ time.timeTsToStr(plan.start) }}~{{ time.timeTsToStr(plan.end) }}
            </div>
          </div>
          <div class="text-caption">{{ plan.statusDesc }}</div>
          <div
            class="text-h6 font-weight-black"
            v-if="plan.timeLeft"
            :class="[plan.status === 'ing' ? 'text-warning' : 'text-primary']"
          >{{ plan.timeLeft }}</div>
        </div>
      </v-sheet>
      <!--当日课表-->
      <div class="mt-1">
        <table style="border-spacing: 4px;">
          <tbody>
            <tr v-for="i in courseRows" class="bg-white">
              <td
                v-if="i.period"
                v-html="i.period.desc"
                :rowspan="i.period.len"
                class="text-caption text-center pa-1"
                :style="{ 'background-color': i.period.bgColor }"
              ></td>
              <td class="pa-1 text-caption">
                {{ i.hour.start }}<br>
                {{ i.hour.end }}
              </td>
              <td v-if="i.course" :rowspan="i.course.len" :class="i.course.status" class="pa-1 w-100">
                <div class="float-left">
                  <div class="text-h5">{{ i.course.title }}</div>
                  <div>
                    {{ i.course.courseRemark }}
                    <template v-if="i.course.arrRemark"><br>{{ i.course.arrRemark }}</template>
                  </div>
                  <div class="text-caption d-flex align-center">
                    <v-icon icon="mdi-map-marker-outline"></v-icon>
                    <div class="ml-1 text-body-2">
                      {{ i.course.place }}
                    </div>
                  </div>
                </div>
                <div v-if="i.course.timeLeft" class="text-center d-flex flex-column justify-center float-right">
                  <div class="text-caption">{{ i.course.statusDesc }}</div>
                  <div
                    class="text-h6 font-weight-black"
                    :class="[i.course.status === 'ing' ? 'text-success' : 'text-warning' ]"
                  >{{ i.course.timeLeft }}</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--事件-->
      <v-sheet
        class="mt-2 pa-3 d-flex"
        v-for="event in events"
        :class="event.status"
      >
        <div style="width: 70%">
          <div class="text-h5">{{ event.title }}</div>
          <div>{{ event.content }}</div>
        </div>
        <div class="text-center d-flex flex-column justify-center" style="width: 30%">
          <template v-if="today < event.date">
            <div class="text-caption d-flex align-center justify-center">
              <v-icon icon="mdi-calendar-outline"></v-icon>
              <div class="ml-1 text-body-2">
                {{ time.dateTsToStr(event.date, '-', false) }}
              </div>
            </div>
            <div class="text-caption">还剩</div>
            <div class="text-h6 font-weight-black text-primary" >{{ event.timeLeft }}</div>
          </template>
          <template v-else>
            <div class="text-caption d-flex align-center justify-center">
              <v-icon icon="mdi-timelapse"></v-icon>
              <div class="ml-1 text-body-2">
                {{ time.timeTsToStr(event.time) }}
              </div>
            </div>
            <div class="text-caption">{{ event.statusDesc }}</div>
            <div class="text-h6 font-weight-black text-warning" >{{ event.timeLeft }}</div>
          </template>
        </div>
      </v-sheet>
    </div>
  </v-main>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import time from '../../utils/time'
import scheduler from '../../service/scheduler.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const LS = window.localStorage
function deltaToStr(d) {
  const h = Math.floor(d / 3600),
    m = Math.floor((d % 3600) / 60)
  return h ? `${h}h${m}min` : `${m}min`
}

const today = ref(time.today())
const curTime = ref(time.curTime())

const expiredCount = computed(() => {
  return scheduler.countExpired(today.value, curTime.value)
})

const onVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    today.value = time.today()
    curTime.value = time.curTime()
  }
}
onMounted(() => {
  document.addEventListener('visibilitychange', onVisibilityChange)
})
onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

const cmp = (x, y) => x.end === y.end ? x.start - y.start : x.end - y.end

const plans = computed(() => {
  let res = [...scheduler.plans(today.value), ...scheduler.routines(today.value)].sort(cmp)
  res = res.filter(x => x.start !== 0 || x.end !== 86340).concat(res.filter(x => x.start === 0 && x.end === 86340))
  res = res.map(x => {
    let t
    if (x.start === 0 && x.end === 86340) {
      t = { status: 'ing' }
    } else if (curTime.value > x.end) {
      t = {
        status: 'past',
        statusDesc: '已结束'
      }
    } else if (curTime.value >= x.start) {
      t = {
        status: 'ing',
        statusDesc: '距离结束还剩',
        timeLeft: deltaToStr(x.end - curTime.value)
      }
    } else {
      t = {
        status: 'future',
        statusDesc: '距离开始还剩',
        timeLeft: deltaToStr(x.start - curTime.value)
      }
    }
    return Object.assign(x, t)
  })
  return res
})

const events = computed(() => scheduler.events(today.value).map(x => {
  let res
  if (x.date > today.value) {
    res = {
      status: 'future',
      statusDesc: '还剩',
      timeLeft: `${Math.floor((x.date - today.value) / 86400)}天`
    }
  } else if (x.time > curTime.value) {
    res = {
      status: 'future',
      statusDesc: '还剩',
      timeLeft: deltaToStr(x.time - curTime.value)
    }
  } else {
    res = {
      status: 'past',
      statusDesc: '已逾期',
    }
  }
  return Object.assign(x, res)
}))

const courses = computed(() => scheduler.courses(today.value))

const hour = JSON.parse(LS.hour)
const period = JSON.parse(LS.period)

const courseRows = computed(() => {
  const res = []
  for (const i of hour) {
    res.push({
      hour: {
        start: time.timeTsToStr(i[0]),
        end: time.timeTsToStr(i[1])
      }
    })
  }

  for (let i = 0; i < period.length; ++i) {
    const j = period[i]
    const st = hour[j[0] - 1][0]
    let descChar = '', bgColor = ''
    if (st < 43200) {
      descChar = 'A'
      bgColor = '#B2DFDB'
    } else if (st < 64800) {
      descChar = 'P'
      bgColor = '#BBDEFB'
    } else {
      descChar = 'N'
      bgColor = '#D1C4E9'
    }
    res[j[0] - 1].period = {
      len: j[1] - j[0] + 1,
      desc: `${descChar}<br>${i + 1}`,
      bgColor
    }
  }

  let flag = true
  for (const i of courses.value) {
    const start = hour[i.hour[0] - 1][0],
      end = hour[i.hour[1] - 1][1]
    let t
    if (curTime.value > end) {
      t = {
        status: 'expired'
      }
    } else if (curTime.value >= start) {
      t = {
        status: 'ing',
        statusDesc: '距离下课还剩',
        timeLeft: deltaToStr(end - curTime.value)
      }
    } else if (flag) {
      t = {
        status: 'future',
        statusDesc: '距离上课还剩',
        timeLeft: deltaToStr(start - curTime.value)
      }
      flag = false
    } else {
      t = {
        status: 'future'
      }
    }
    res[i.hour[0] - 1].course = Object.assign(t, {
      len: i.hour[1] - i.hour[0] + 1,
      place: i.place,
      arrRemark: i.remark,
      courseRemark: i.course.remark,
      title: i.course.title,
    })
  }
  return res
})

</script>

<style scoped>
.expired {
  border-left: #b0b0b0 4px solid;
}

.past {
  border-left: #FB8C00 4px solid;
}

.ing {
  border-left: #0091EA 4px solid;
}

.future {
  border-left: #4CAF50 4px solid;
}
</style>
