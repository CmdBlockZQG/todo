<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-btn flat round icon="arrow_back" @click="router.back()" />
      <q-toolbar-title>浏览日程</q-toolbar-title>
    </q-toolbar>
    <q-tabs v-model="tab" @update:model-value="updateTab">
      <q-tab name="0" label="今天" />
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
      <div v-if="courses.length === 0" style="text-align: center; color: grey;">
        <div style="font-size: 80px;"><q-icon name="free_breakfast" /></div>
        <p>这一天没有安排！<br>享受自由安排时间的感觉吧！</p>
      </div>
      <Course v-for="course in courses" :course="course"></Course>
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

const router = useRouter()
const dateMap = ['？', '一', '二', '三', '四', '五', '六', '日']

const tab = ref('0')
const today = ref(new Date(new Date().toLocaleDateString()))
const termStart = ref(new Date())
const hour = ref([])
const week = computed(() => 1 + Math.floor((today.value.getTime() - termStart.value.getTime()) / (7 * 86400 * 1000)))
const day = computed(() => {
  const d = today.value.getDay()
  return d ? d : 7
})

const courses = ref([])

async function updateCourses() {
  return (await getCourses(week.value, day.value)).map((c) => {
    c.startTs = hour.value[c.hour[0] - 1][0]
    c.endTs = hour.value[c.hour[1] - 1][1]
    return c
  })
}

onMounted(async () => {
  termStart.value = new Date(await setting.get('termStart'))
  hour.value = await setting.get('hour')
  courses.value = await updateCourses()
})

async function updateTab(tab) {
  if (tab === '3') return
  today.value = new Date(new Date(new Date().toLocaleDateString()).getTime() + 86400 * 1000 * Number(tab))
  courses.value = await updateCourses()
}

const datePicker = ref(false)
const dateProxy = ref(date.formatDate(Date.now(), 'YYYY/MM/DD'))

async function pickDate() {
  datePicker.value = false
  today.value = new Date(dateProxy.value)
  courses.value = await updateCourses()
}

</script>

<style scoped>

</style>
