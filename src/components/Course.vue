<template>
  <div
    class="q-pa-sm shadow-4"
    style="border-radius: 8px; border-left: 8px solid;"
    :style="{ 'border-color': props.status ? colorMap[props.status] : '#bdbdbd' }"
  >
    <div class="text-h5">
      {{ props.course.name }}
      <q-badge color="blue">
        {{ props.course.id }}
      </q-badge>
    </div>
    <div class="text-body1">
      <q-icon name="schedule" />
      {{ stringifyTime(props.course.startTs) }} — {{ stringifyTime(props.course.endTs) }}
      <q-icon name="place" />
      {{ props.course.place }}
    </div>
    <div class="text-body2">{{ props.course.remark }}</div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import { stringifyTime } from '../service/utils.js'

const props = defineProps(['course', 'status'])

const colorMap = {
  'normal': '#bdbdbd',
  'active': '#1976d2',
  'expired': '#21ba45'
}

</script>

<style scoped>

</style>
