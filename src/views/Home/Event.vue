<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-toolbar-title>事项</q-toolbar-title>
      <q-btn flat round icon="more_vert" >
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="router.push('/event/new')">
              <q-item-section>新建日程</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="router.push('/event/newR')">
              <q-item-section>新建重复日程</q-item-section>
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
    <div class="q-pa-md q-gutter-md">
      <Event v-for="event in events" :event="event" :status="getStatus(event)" @click="edit(event._id)"></Event>
    </div>
  </q-page-container>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getTodayEvents, getExpiredEvents, getFutureEvents } from '../../service/event.js'
import Event from '../../components/Event.vue'

const router = useRouter()
const now = ref(new Date())
const today = computed(() => new Date(now.value.toLocaleDateString()))
const tab = ref('today')

const events = ref([])

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
      break
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

</script>

<style scoped>

</style>
