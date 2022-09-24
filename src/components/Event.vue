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
import { stringifyTime } from '../service/utils.js'

const props = defineProps(['event', 'status'])

const colorMap = {
  'normal': '#bdbdbd',
  'active': '#1976d2',
  'expired': '#c10015'
}

</script>

<style scoped>

</style>
