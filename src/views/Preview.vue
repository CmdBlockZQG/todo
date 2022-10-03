<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-btn flat round icon="arrow_back" @click="router.back()" />
      <q-toolbar-title>浏览日程</q-toolbar-title>
    </q-toolbar>
    <q-tabs v-model="tab" @update:model-value="updateTab">
      <q-tab name="1" label="明天" />
      <q-tab name="2" label="后天" />
      <q-tab name="3" label="其他" @click="datePicker = true" />
    </q-tabs>
  </q-header>
  <q-page-container>
    <div class="q-pa-md q-gutter-md">
      <q-chip color="primary" text-color="white" icon="event" clickable @click="tab = '3'; datePicker = true;">
        {{ today.getMonth() + 1 }}月{{ today.getDate() }}日 第{{ week }}周星期{{ dateMap[day] }}
      </q-chip>
      <div class="title">课程</div>
      <Course v-for="course in courses" :course="course"></Course>
      <template v-if="today.getTime() > realToday.getTime()">
        <div class="title">事项</div>
        <Event v-for="event in events" :event="event" @delete="update"></Event>
      </template>
    </div>
  </q-page-container>
  <q-dialog v-model="datePicker">
    <q-date v-model="dateProxy" today-btn>
      <div class="row items-center justify-end q-gutter-sm">
        <q-btn label="确认" color="primary" flat @click="pickDate" v-close-popup />
      </div>
    </q-date>
  </q-dialog>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { date } from 'quasar'
import setting from '../service/setting.js'
import { getCourses } from '../service/course.js'
import Course from '../components/Course.vue'
import Event from '../components/Event.vue'
import { getTodayEvents } from '../service/event.js'
import { arrangeEvent } from '../service/day.js'

const router = useRouter()
const dateMap = ['？', '一', '二', '三', '四', '五', '六', '日']

const realToday = new Date(new Date().toLocaleDateString())

const tab = ref('1')
const today = ref(new Date(new Date(new Date().toLocaleDateString()).getTime() + 86400000))
const termStart = ref(new Date())
const hour = ref([])
const week = computed(() => 1 + Math.floor((today.value.getTime() - termStart.value.getTime()) / (7 * 86400 * 1000)))
const day = computed(() => {
  const d = today.value.getDay()
  return d ? d : 7
})

const courses = ref([])
const events = ref([])

async function update() {
  courses.value = (await getCourses(week.value, day.value)).map((c) => {
    c.startTs = hour.value[c.hour[0] - 1][0]
    c.endTs = hour.value[c.hour[1] - 1][1]
    return c
  })
  if (today.value.getTime() > realToday.getTime()) {
    let a = await getTodayEvents(today.value.getTime()),
        b = await arrangeEvent(null, today.value.getTime(), week.value, day.value)
    let res = a.concat(b)
    res.sort((a, b) => a.end === b.end ? a.start - b.start : a.end - b.end)
    events.value = res
  }
}

onMounted(async () => {
  termStart.value = new Date(await setting.get('termStart'))
  hour.value = await setting.get('hour')
  await update()
})

async function updateTab(tab) {
  if (tab === '3') return
  today.value = new Date(new Date(new Date().toLocaleDateString()).getTime() + 86400 * 1000 * Number(tab))
  await update()
}

const datePicker = ref(false)
const dateProxy = ref(date.formatDate(Date.now(), 'YYYY/MM/DD'))

async function pickDate() {
  datePicker.value = false
  today.value = new Date(dateProxy.value)
  await update()
}

</script>

<style scoped>
.title {
  border-radius: 2px;
  border-left: 4px solid #1976d2;
  border-bottom: 2px solid #bdbdbd;
  padding-left: 8px;
  font-size: 20px;
  font-weight: bold;
}
</style>
