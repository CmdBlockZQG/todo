<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-toolbar-title>事项</q-toolbar-title>
      <q-btn flat round icon="more_vert" >
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="router.push('/event/new')">
              <q-item-section>新建事项</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="router.push('/event/newR')">
              <q-item-section>新建重复事项</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="shortcut.明天全员核酸()">
              <q-item-section>明天全员核酸</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="shortcut.明天一号床核酸()">
              <q-item-section>明天一号床核酸</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <q-tabs v-model="tab" @update:model-value="updateTab">
      <q-tab name="all" label="全部" />
      <q-tab name="expired" label="逾期" />
      <q-tab name="future" label="未来" />
      <q-tab name="repeat" label="重复" />
    </q-tabs>
  </q-header>

  <q-page-container>
    <div v-if="events.length === 0" style="text-align: center; color: grey;">
      <div style="font-size: 80px;"><q-icon name="free_breakfast" /></div>
      <p v-if="tab === 'all'">没有事项！<br>看起来可以放松放松了呢。</p>
      <p v-if="tab === 'expired'">没有已逾期的事项！<br>今日事今日毕，可得一身轻。</p>
      <p v-if="tab === 'future'">没有未来事项！<br>接下来几天做点什么呢？</p>
      <p v-if="tab === 'repeat'">没有重复事项！<br>习惯的养成要靠重复，对吧？</p>
    </div>
    <div v-if="tab === 'repeat'" class="q-pa-md q-gutter-md">
      <div v-for="event in events">
        <div
          class="q-pa-sm shadow-4"
          style="border-radius: 8px; border-left: 8px solid #1976d2;"
        >
          <div class="text-h5">
            {{ event.name }}
          </div>
          <div class="text-body1">
            <q-icon name="schedule" />
            {{ event.type === 'xd' ? `每${event.cycle}天` : typeMap[event.type] }}
            <q-icon name="auto_delete" v-show="event.autoDel" />
          </div>
          <div class="text-body2">{{ event.remark }}</div>
        </div>
        <q-menu touch-position>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="editR(event._id)">
              <q-item-section>编辑重复事项</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="delR(event._id, event.name)">
              <q-item-section>删除重复事项</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </div>
    <div v-else class="q-pa-md q-gutter-md">
      <div v-for="event in events">
        <Event :event="event" :status="getStatus(event)" @delete="updateTab(tab)" :ts="now.getTime()"></Event>
      </div>
    </div>
  </q-page-container>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'quasar'
import { getAllEvents, getExpiredEvents, getFutureEvents } from '../../service/event.js'
import { dailyUpdate } from '../../service/day.js'
import db from '../../service/db.js'
import Event from '../../components/Event.vue'

import shortcut from '../../service/shortcut.js'

const router = useRouter()
const now = ref(new Date())
const today = computed(() => new Date(now.value.toLocaleDateString()))
const tab = ref('all')

const events = ref([])

const typeMap = {
  'd': '每日',
  'w': '每周',
  'm': '每月',
  'ow': '单周',
  'ew': '双周'
}

async function init() {
  await dailyUpdate()
  now.value = new Date()
  events.value = await getAllEvents(today.value.getTime())
}
onMounted(init)
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') init()
})

async function updateTab(tab) {
  switch (tab) {
    case 'all':
      events.value = await getAllEvents(today.value.getTime())
      break
    case 'expired':
      events.value = await getExpiredEvents(today.value.getTime())
      break
    case 'future':
      events.value = await getFutureEvents(today.value.getTime())
      break
    case 'repeat':
      events.value = await db.getAll('eventR')
      break
  }
}

function getStatus(event) {
  if (event.day < today.value.getTime()) return 'expired'
  if (today.value.getTime() < event.day) return 'normal'
  const t = now.value.getTime() - today.value.getTime()
  if (t < event.start) return 'normal'
  if (event.start <= t && t <= event.end) return 'active'
  if (event.end < t) return 'expired'
  return 'normal'
}

function editR(_id) {
  router.push('/event/editR/' + _id)
}

function delR(_id, hint) {
  Dialog.create({
    title: '确定删除重复事项？',
    message: `重复事项“${hint}”将被删除，且此操作不可逆。`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await dailyUpdate()
    await db.delOne('eventR', _id)
    await updateTab(tab.value)
  })
}

</script>

<style scoped>

</style>
