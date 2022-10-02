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
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <q-tabs v-model="tab" @update:model-value="updateTab">
      <q-tab name="today" label="今日" />
      <q-tab name="expired" label="逾期" />
      <q-tab name="future" label="未来" />
      <q-tab name="repeat" label="重复" />
    </q-tabs>
  </q-header>

  <q-page-container>
    <div v-if="tab === 'repeat'" class="q-pa-md q-gutter-md">
      <div v-for="event in events">
        <div
          class="q-pa-md shadow-4"
          style="border-radius: 8px; border-left: 8px solid #bdbdbd;"
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
        <Event :event="event" :status="getStatus(event)"></Event>
        <q-menu touch-position>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="edit(event._id)">
              <q-item-section>编辑事项</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="del(event._id, event.name)">
              <q-item-section>删除事项</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </div>
    </div>
  </q-page-container>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'quasar'
import { getTodayEvents, getExpiredEvents, getFutureEvents } from '../../service/event.js'
import db from '../../service/db.js'
import Event from '../../components/Event.vue'

const router = useRouter()
const now = ref(new Date())
const today = computed(() => new Date(now.value.toLocaleDateString()))
const tab = ref('today')

const events = ref([])

const typeMap = {
  'd': '每日',
  'w': '每周',
  'm': '每月',
  'ow': '单周',
  'ew': '双周'
}

onMounted(async () => {
  events.value = await getTodayEvents(today.value.getTime())
  events.value.sort((a, b) => a.end === b.end ? a.start - b.start : a.end - b.end)
})

async function updateTab(tab) {
  switch (tab) {
    case 'today':
      events.value = await getTodayEvents(today.value.getTime())
      break
    case 'expired':
      events.value = await getExpiredEvents(today.value.getTime())
      break
    case 'future':
      events.value = await getFutureEvents(today.value.getTime())
      break
    case 'repeat':
      events.value = await db.getAll('eventR')
      return
  }
  events.value.sort((a, b) => a.end === b.end ? a.start - b.start : a.end - b.end)
}

function getStatus(event) {
  if (tab.value === 'expired') return 'expired'
  if (tab.value === 'future') return 'normal'
  const t = now.value.getTime() - today.value.getTime()
  if (t < event.start) return 'normal'
  if (event.start <= t && t <= event.end) return 'active'
  if (event.end < t) return 'expired'
  return 'normal'
}

function edit(_id) {
  router.push('/event/edit/' + _id)
}

function del(_id, hint) {
  Dialog.create({
    title: '确定删除事项？',
    message: `事项“${hint}”将被删除，且此操作不可逆。`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await db.delOne('event', _id)
    await updateTab(tab.value)
  })
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
    await db.delOne('eventR', _id)
    await updateTab(tab.value)
  })
}

</script>

<style scoped>

</style>
