<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-toolbar-title>{{ now.getMonth() + 1 }}月{{ now.getDate() }}日 第{{ week }}周星期{{ dateMap[day] }}</q-toolbar-title>
      <q-btn flat round icon="calendar_month" @click="router.push('/preview')"/>
    </q-toolbar>
  </q-header>


  <q-pull-to-refresh @refresh="init">
    <q-page-container>
      <div class="q-pa-md q-gutter-md">
        <Course v-for="course in courses" :course="course" :hour="hour" :active="now.getTime() - today.getTime()"></Course>
      </div>
    </q-page-container>
  </q-pull-to-refresh>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCourses } from '../../service/course.js'
import setting from '../../service/setting.js'
import Course from '../../components/Course.vue'

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

async function init(done) {
  now.value = new Date()
  termStart.value = new Date(await setting.get('termStart'))
  hour.value = await setting.get('hour')
  courses.value = await getCourses(week.value, day.value)
  if (done) done()
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') init()
})

onMounted(init)

</script>

<style scoped>

</style>
