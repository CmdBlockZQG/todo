<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-toolbar-title>{{ now.getMonth() + 1 }}月{{ now.getDate() }}日 第{{ week }}周星期{{ dateMap[day] }}</q-toolbar-title>
      <q-btn flat round icon="running_with_errors" v-if="expiredCount" @click="displayExpired = true">
        <q-badge color="red" rounded floating>{{ expiredCount }}</q-badge>
      </q-btn>
      <q-btn flat round icon="calendar_month" @click="router.push('/preview')"/>
    </q-toolbar>
  </q-header>


  <q-page-container>
    <div class="q-pa-md q-gutter-md">
      <div class="title">课程</div>
      <Course v-for="(course, i) in courses" :course="course" :hour="hour" :status="courseStat[i]"></Course>
      <div class="title">事项</div>
      <Event v-for="(event, i) in events" :event="event" :status="eventStat[i]" @delete="init"></Event>
      <div class="title">计划</div>
      <Plan v-for="plan in activePlans" :plan="plan" :status="'active'" :ts="now.getTime()" @delete="init"></Plan>
    </div>
  </q-page-container>

  <q-dialog maximized v-model="displayExpired" transition-show="slide-down" transition-hide="slide-up">
    <q-card>
      <q-toolbar class="bg-primary text-white">
        <q-toolbar-title>已逾期</q-toolbar-title>
        <q-btn flat round icon="close" @click="displayExpired = false"/>
      </q-toolbar>
      <div class="q-pa-md q-gutter-md">
        <div class="title">事项</div>
        <Event v-for="event in expiredEvents" :event="event" :status="'expired'" :ts="now.getTime()" @delete="init"></Event>
        <div class="title">计划</div>
        <Plan v-for="plan in expiredPlans" :plan="plan" :status="'expired'" :ts="now.getTime()" @delete="init"></Plan>
      </div>
    </q-card>
  </q-dialog>

</template>

<script setup>
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCourses } from '../../service/course.js'
import setting from '../../service/setting.js'
import Course from '../../components/Course.vue'
import Event from '../../components/Event.vue'
import Plan from '../../components/Plan.vue'
import { dailyUpdate } from '../../service/day.js'
import { getTodayEvents, getExpiredEvents } from '../../service/event.js'
import db from "../../service/db.js";

const router = useRouter()

const dateMap = ['？', '一', '二', '三', '四', '五', '六', '日']

const now = ref(new Date())
const today = computed(() => new Date(now.value.toLocaleDateString()))
const termStart = ref(new Date())
const hour = ref([])
const week = computed(() => 1 + Math.floor((today.value.getTime() - termStart.value.getTime()) / (7 * 86400 * 1000)))
const day = computed(() => {
  const d = now.value.getDay()
  return d ? d : 7
})

const courses = ref([])
const courseStat = computed(() => {
  const ts = now.value.getTime() - today.value.getTime()
  return courses.value.map((x) => {
    if (x.startTs <= ts && ts <= x.endTs) return 'active'
    if (x.endTs < ts) return 'expired'
    if (x.startTs > ts) return 'normal'
    return 'normal'
  })
})

const events = ref([])
const eventStat = computed(() => {
  const ts = now.value.getTime() - today.value.getTime()
  return events.value.map((x) => {
    if (x.start <= ts && ts <= x.end) return 'active'
    if (x.end < ts) return 'expired'
    if (x.start > ts) return 'normal'
    return 'normal'
  })
})
const expiredEvents = ref([])

const plans = ref([])
const activePlans = computed(() => plans.value.filter((x) => x.start <= now.value.getTime() && now.value.getTime() <= x.end))
const expiredPlans = computed(() => plans.value.filter((x) => x.end < now.value.getTime()))

const expiredCount = computed(() => expiredEvents.value.length + expiredPlans.value.length)
const displayExpired = ref(false)

async function init() {
  await dailyUpdate()
  now.value = new Date()
  termStart.value = new Date(await setting.get('termStart'))
  hour.value = await setting.get('hour')
  courses.value = (await getCourses(week.value, day.value)).map((x) => {
    return {
      ...x,
      startTs: hour.value[x.hour[0] - 1][0],
      endTs: hour.value[x.hour[1] - 1][1]
    }
  })
  events.value = await getTodayEvents(today.value.getTime())
  expiredEvents.value = await getExpiredEvents(today.value.getTime())
  plans.value = await db.getAll('plan')
  plans.value.sort((a, b) => a.end === b.end ? a.start - b.start : a.end - b.end)
}

const onVisibilityChange = () => {
  if (document.visibilityState === 'visible') init()
}
onMounted(() => {
  document.addEventListener('visibilitychange', onVisibilityChange)
  init()
})
onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
})

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
