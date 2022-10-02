<template>
  <div
    class="q-pa-md shadow-4"
    style="border-radius: 8px; border-left: 8px solid;"
    :style="{ 'border-color': props.status ? colorMap[props.status] : '#bdbdbd' }"
  >
    <div class="text-h5">
      {{ props.plan.name }}
    </div>
    <div class="text-body1">
      <q-icon name="schedule" />
      {{ props.plan.start === 0 ? '?' : new Date(props.plan.start).toLocaleString() }}
      —
      {{ props.plan.end === 4000000000000 ? '?' : new Date(props.plan.end).toLocaleString() }}
      <br>
      <q-icon name="alarm" />{{ progressText }}
    </div>
    <div class="text-body2">{{ props.plan.remark }}</div>
  </div>
  <q-menu touch-position>
    <q-list style="min-width: 100px">
      <q-item clickable v-close-popup @click="router.push('/plan/edit/' + props.plan._id)">
        <q-item-section>编辑计划</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="del">
        <q-item-section>删除计划</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'quasar'
import db from '../service/db.js'

const emit = defineEmits(['delete'])
const props = defineProps(['plan', 'status'])
const router = useRouter()

const colorMap = {
  'normal': '#bdbdbd',
  'active': '#1976d2',
  'expired': '#c10015'
}

const now = new Date().getTime()

const stringifyDuration = (t) => t < 86400 * 1000 ? `${Math.floor(t / 3600000)}小时` : `${Math.floor(t / 86400000)}天`

const progressText = computed(() => {
  const noStart = props.plan.start === 0,
        noEnd = props.plan.end === 4000000000000
  if (noStart && noEnd) return '始终'
  let t = now - props.plan.end
  if (t > 0) return '已逾期' + stringifyDuration(t)
  t = props.plan.start - now
  if (t > 0) return `还有${stringifyDuration(t)}开始`
  if (!noEnd) return `离逾期还剩${stringifyDuration(props.plan.end - now)}`
  return `已进行${stringifyDuration(now - props.plan.start)}`
})

function del() {
  Dialog.create({
    title: '确定删除计划？',
    message: `计划“${props.plan.name}”将被删除，且此操作不可逆。`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await db.delOne('plan', props.plan._id)
    emit('delete')
  })
}

</script>

<style scoped>

</style>
