<template>
  <div class="overflow-hidden bg-grey-lighten-3 h-100 pb-6">
    <div class="mt-2 px-6 d-flex align-center justify-space-between">
      <v-btn icon="mdi-chevron-left" variant="text" density="compact" @click="step(-1)" :disabled="week === 1"></v-btn>
      <v-btn variant="tonal" density="compact">第{{ week }}周</v-btn>
      <v-btn icon="mdi-chevron-right" variant="text" density="compact" @click="step(1)"></v-btn>
    </div>
    <table v-if="refreshTable" class="w-100" style="border-spacing: 4px; table-layout: fixed;">
      <colgroup>
        <col style="width: 16px;" />
        <col style="width: 36px;" />
      </colgroup>
      <thead>
        <tr>
          <th></th>
          <th></th>
          <th v-for="(th, i) in thead" :class="[ th.today ? 'bg-indigo' : 'bg-white' ]">
            <div class="text-subtitle-2 font-weight-bold">{{ th.day }}</div>
            <div class="text-caption">{{ th.text }}</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rh, j) in rowHead">
          <td
            v-if="rh.period"
            v-html="rh.period.desc"
            :rowspan="rh.period.len"
            class="text-caption text-center"
            :style="{ 'background-color': rh.period.bgColor }"
          >
          </td>
          <td class="text-caption text-center bg-white">
            {{ rh.hour.start }}<br>
            {{ rh.hour.end }}
          </td>
          <template v-for="i in visibleDayIndices">
            <td v-if="courseTable[i][j] === 0"></td>
            <td
              v-else-if="courseTable[i][j] !== 1"
              :rowspan="courseTable[i][j].len"
              :class="[courseTable[i][j].bgClass]"
              class="pa-1 text-caption"
              style="cursor: pointer;"
              @click="showDetails(courseTable[i][j])"
            >
              <div class="mb-1" style="line-height: 1.2em;">{{ courseTable[i][j].title }}</div>
              <div style="line-height: 1.2em;">{{ courseTable[i][j].place }}</div>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>

  <v-dialog
    v-model="detailDialogOpen"
    width="300"
  >
    <v-card>
      <v-card-title><span class="text-h5">{{ curCourse.title }}</span></v-card-title>
      <v-card-text>
        <div>{{ curCourse.courseRemark }}</div>
        <div>{{ curCourse.arrRemark }}</div>
        <div class="text-caption d-flex align-center">
          <v-icon icon="mdi-map-marker-outline"></v-icon>
          <div class="ml-1 text-body-2">
            {{ curCourse.place }}
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>

</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import time from '../../utils/time'
import TimePicker from "../../components/TimePicker.vue";
import DatePicker from "../../components/DatePicker.vue";

const LS = window.localStorage

const week = ref(time.curWeek())

const hour = JSON.parse(LS.hour)
const period = JSON.parse(LS.period)
const rowHead = []
for (const i of hour) {
  rowHead.push({
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
  rowHead[j[0] - 1].period = {
    len: j[1] - j[0] + 1,
    desc: `${descChar}<br>${i + 1}`,
    bgColor
  }
}

const bgClasses = [
  'bg-blue-darken-1',
  'bg-green',
  'bg-amber-darken-4',
  'bg-deep-purple',
  'bg-pink',
  'bg-blue-grey',
  'bg-brown',
  'bg-indigo',
  'bg-red',
  'bg-cyan-accent-4',
  'bg-light-green-darken-3',
  'bg-purple',
  'bg-light-blue',
  'bg-lime-darken-3',
  'bg-teal',
  'bg-deep-orange-darken-4',
]

const courseTable = computed(() => {
  const res = new Array(7).fill(0).map(() => new Array(hour.length).fill(0))
  const arrIdList = JSON.parse(LS.arr)
  let bgIndex = 0
  const bgMap = {}
  for (let arrId of arrIdList) {
    const arr = JSON.parse(LS[arrId])
    if (arr.week.indexOf(week.value) === -1) continue
    const id = arr.courseId
    const course = JSON.parse(LS[id])
    const len = arr.hour[1] - arr.hour[0] + 1
    const i = arr.day - 1, j = arr.hour[0] - 1
    if (!bgMap[id]) {
      bgMap[id] = bgClasses[bgIndex]
      bgIndex = (bgIndex + 1) % bgClasses.length
    }
    res[i][j] = {
      len,
      title: course.title,
      courseRemark: course.remark,
      arrRemark: arr.remark,
      place: arr.place,
      bgClass: bgMap[id]
    }
    for (let d = 1; d < len; ++d) {
      res[i][j + d] = 1
    }
  }
  return res
})

const courseWeekend = computed(() => { // 周末有没有课
  let flag = false
  for (let i = 0; i < 7; ++i) {
    const weekday = (i + 1) % 7
    if (weekday === 0 || weekday === 6) {
      for (let j = 0; j < hour.length; ++j) {
        if (courseTable.value[i][j] !== 0) {
          flag = true
          break
        }
      }
    }
    if (flag) break
  }
  return flag
})

const visibleDayIndices = computed(() => {
  const all = Array.from({ length: 7 }, (_, i) => (time.weekStart() + i + 6) % 7)
  if (courseWeekend.value) return all
  return all.filter(i => {
    const weekday = (i + 1) % 7
    return weekday !== 0 && weekday !== 6
  })
})

const thead = computed(() => {
  const res = []
  const t = time.weekStartTs(week.value)
  for (const i of visibleDayIndices.value) {
    const dayOffset = ((i + 1) % 7 - time.weekStart() + 7) % 7
    res.push({
      day: i + 1,
      text: time.dateTsToStr(t + dayOffset * 86400, '-', false),
      today: t + dayOffset * 86400 === time.today()
    })
  }
  return res
})

const refreshTable = ref(true)
function step(d) {
  refreshTable.value = false
  week.value += d
  nextTick(() => {
    refreshTable.value = true
  })
}

const detailDialogOpen = ref(false)
const curCourse = ref({})
function showDetails(c) {
  curCourse.value = c
  detailDialogOpen.value = true
}

</script>

<style scoped>

</style>
