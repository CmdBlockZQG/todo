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
      {{ stringifyTime(props.event.start) }} - {{ stringifyTime(props.event.end) }}
      <q-icon name="auto_delete" v-show="props.event.autoDel" />
    </div>
    <div class="text-body2">{{ props.event.remark }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps(['event', 'status'])

const colorMap = {
  'normal': '#bdbdbd',
  'active': '#1976d2',
  'expired': '#c10015'
}

function stringifyTime(ts) {
  ts /= 1000
  const h = Math.floor(ts / 3600)
  ts %= 3600
  const m = Math.floor(ts / 60)
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`
}

</script>

<style scoped>

</style>
