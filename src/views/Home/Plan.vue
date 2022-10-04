<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-toolbar-title>计划</q-toolbar-title>
      <q-btn flat round icon="more_vert" >
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="router.push('/plan/new')">
              <q-item-section>新建计划</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <q-tabs v-model="tab">
      <q-tab name="all" label="全部" />
      <q-tab name="expired" label="逾期" />
      <q-tab name="future" label="未来" />
    </q-tabs>
  </q-header>

  <q-page-container>
    <q-tab-panels v-model="tab">
      <q-tab-panel name="all">
        <div v-if="plans.length === 0" style="text-align: center; color: grey;">
          <div style="font-size: 80px;"><q-icon name="free_breakfast" /></div>
          <p>没有计划！<br>赶紧把空虚的生活充实起来吧！</p>
        </div>
        <div class="q-gutter-md">
          <div v-for="(plan, i) in plans">
            <Plan :plan="plan" :status="planStatus[i]" @delete="init" :ts="now.getTime()"></Plan>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="expired">
        <div v-if="expiredPlans.length === 0" style="text-align: center; color: grey;">
          <div style="font-size: 80px;"><q-icon name="free_breakfast" /></div>
          <p>没有已逾期的计划！<br>在规定的时间内完成任务，正确的。</p>
        </div>
        <div class="q-gutter-md">
          <div v-for="plan in expiredPlans">
            <Plan :plan="plan" :status="'expired'" @delete="init" :ts="now.getTime()"></Plan>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="future">
        <div v-if="futurePlans.length === 0" style="text-align: center; color: grey;">
          <div style="font-size: 80px;"><q-icon name="free_breakfast" /></div>
          <p>没有未来计划！<br>对未来有计划，是成功的必要条件。</p>
        </div>
        <div class="q-gutter-md">
          <div v-for="plan in futurePlans">
            <Plan :plan="plan" :status="'normal'" @delete="init" :ts="now.getTime()"></Plan>
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page-container>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import db from '../../service/db.js'
import Plan from '../../components/Plan.vue'

const router = useRouter()
const now = ref(new Date())
const tab = ref('all')

const plans = ref([])

async function init() {
  now.value = new Date()
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

const planStatus = computed(() => plans.value.map((x) => {
  if (x.end < now.value.getTime()) return 'expired'
  if (x.start > now.value.getTime()) return 'normal'
  return 'active'
}))
const expiredPlans = computed(() => plans.value.filter((x) => x.end < now.value.getTime()))
const futurePlans = computed(() => plans.value.filter((x) => x.start > now.value.getTime()))

</script>

<style scoped>

</style>
