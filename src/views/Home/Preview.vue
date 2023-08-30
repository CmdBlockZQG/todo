<template>
  <v-app-bar density="compact">
    <template v-slot:prepend>
      <v-btn icon="mdi-arrow-left" @click="router.back()"></v-btn>
    </template>
    <v-app-bar-title>浏览日程</v-app-bar-title>
  </v-app-bar>
  <v-main>
    <div class="overflow-hidden bg-grey-lighten-3 h-100 pb-6">
      <div class="mt-2 px-6 d-flex align-center justify-space-between">
        <v-btn icon="mdi-chevron-left" variant="text" @click="step(-86400)"></v-btn>
        <DatePicker v-model="today"></DatePicker>
        <v-btn icon="mdi-chevron-right" variant="text" @click="step(86400)"></v-btn>
      </div>
      <v-sheet
        class="mt-2 pa-3 d-flex box"
        v-for="plan in plans"
      >
        <div style="width: 70%">
          <div class="text-h5">{{ plan.title }}</div>
          <div>
            {{ plan.content }}
            <template v-if="plan.remark"><br>{{ plan.remark }}</template>
          </div>
        </div>
        <div v-if="plan.start !== 0 || plan.end !== 86340" class="text-center d-flex flex-column justify-center" style="width: 30%">
          <div class="text-caption d-flex align-center justify-center">
            <v-icon icon="mdi-clock-outline"></v-icon>
            <div class="ml-1 text-body-2">
              {{ time.timeTsToStr(plan.start) }}~{{ time.timeTsToStr(plan.end) }}
            </div>
          </div>
        </div>
      </v-sheet>
      <!--当日课表-->
      <div class="mt-1">
        <table v-if="refreshTable" style="border-spacing: 4px;">
          <tbody>
          <tr v-for="i in courseRows" class="bg-white">
            <td v-if="i.period" v-html="i.period.desc" :rowspan="i.period.len" class="text-caption text-center pa-1">
            </td>
            <td class="pa-1 text-caption">
              {{ i.hour.start }}<br>
              {{ i.hour.end }}
            </td>
            <td v-if="i.course" :rowspan="i.course.len" class="pa-1 w-100 box">
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
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <!--事件-->
      <v-sheet
        class="mt-2 pa-3 d-flex box"
        v-for="event in events"
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
            <div class="text-h6 font-weight-black" >{{ event.timeLeft }}</div>
          </template>
          <template v-else>
            <div class="text-caption d-flex align-center justify-center">
              <v-icon icon="mdi-timelapse"></v-icon>
              <div class="ml-1 text-body-2">
                {{ time.timeTsToStr(event.time) }}
              </div>
            </div>
          </template>
        </div>
      </v-sheet>
    </div>
  </v-main>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import time from '../../utils/time.js'
import DatePicker from '../../components/DatePicker.vue'
import scheduler from '../../service/scheduler.js'

const router = useRouter()
const LS = window.localStorage

const today = ref(time.today() + 86400)

const refreshTable = ref(true)
function step(d) {
  refreshTable.value = false
  today.value += d
  nextTick(() => {
    refreshTable.value = true
  })
}

const cmp = (x, y) => x.end === y.end ? x.start - y.start : x.end - y.end
const plans = computed(() => {
  let res = [...scheduler.plans(today.value), ...scheduler.routines(today.value)].sort(cmp)
  res = res.filter(x => x.start !== 0 || x.end !== 86340).concat(res.filter(x => x.start === 0 && x.end === 86340))
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
    let descChar = ''
    if (st < 43200) descChar = 'A'
    else if (st < 64800) descChar = 'P'
    else descChar = 'N'
    res[j[0] - 1].period = {
      len: j[1] - j[0] + 1,
      desc: `${descChar}<br>${i + 1}`
    }
  }

  for (const i of courses.value) {
    res[i.hour[0] - 1].course = {
      len: i.hour[1] - i.hour[0] + 1,
      place: i.place,
      arrRemark: i.remark,
      courseRemark: i.course.remark,
      title: i.course.title,
    }
  }

  return res
})

</script>

<style scoped>
.box {
  border-left: #b0b0b0 4px solid;
}
</style>
