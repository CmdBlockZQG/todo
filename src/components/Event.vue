<template>
  <div
    class="q-pa-md shadow-4"
    style="border-radius: 8px; border-left: 8px solid;"
    :style="{ 'border-color': props.status ? colorMap[props.status] : '#bdbdbd' }"
  >
    <div class="text-h5">
      {{ props.event.name }}
    </div>
    <div class="text-body1">
      <q-icon name="schedule" />
      {{ dateStr }} {{ stringifyTime(props.event.start) }} — {{ stringifyTime(props.event.end) }}
      <q-icon name="auto_delete" v-show="props.event.autoDel" />
    </div>
    <div class="text-body2">{{ props.event.remark }}</div>
  </div>
  <q-menu touch-position>
    <q-list style="min-width: 100px">
      <q-item clickable v-close-popup @click="router.push('/event/edit/' + props.event._id)">
        <q-item-section>编辑事项</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="del">
        <q-item-section>删除事项</q-item-section>
      </q-item>
    </q-list>
  </q-menu>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'quasar'
import db from '../service/db.js'
import { stringifyTime } from '../service/utils.js'

const emit = defineEmits(['delete'])
const props = defineProps(['event', 'status'])
const router = useRouter()

const colorMap = {
  'normal': '#bdbdbd',
  'active': '#1976d2',
  'expired': '#c10015'
}

const dateStr = computed(() => {
  const t = new Date(props.event.day).toLocaleDateString()
  return t === new Date().toLocaleDateString() ? '' : t
})

function del() {
  Dialog.create({
    title: '确定删除事项？',
    message: `事项“${props.event.name}”将被删除，且此操作不可逆。`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await db.delOne('event', props.event._id)
    emit('delete')
  })
}

</script>

<style scoped>

</style>
