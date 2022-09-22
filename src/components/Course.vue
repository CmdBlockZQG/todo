<template>
  <div
    class="q-pa-md shadow-4"
    style="border-radius: 8px; border-left: 8px solid;"
    :style="{ 'border-color': active ? '#1976d2' : '#bdbdbd' }"
  >
    <div class="text-h5">
      {{ props.course.name }}
      <q-badge color="blue">
        {{ props.course.id }}
      </q-badge>
    </div>
    <div class="text-body1">
      <q-icon name="schedule" />
      {{ stringifyTime(startTs) }} - {{ stringifyTime(endTs) }}
      <q-icon name="place" />
      {{ props.course.place }}
    </div>
    <div class="text-body2">{{ props.course.remark }}</div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
const props = defineProps(['course', 'hour', 'active'])

function stringifyTime(ts) {
  ts /= 1000
  const h = Math.floor(ts / 3600)
  ts %= 3600
  const m = Math.floor(ts / 60)
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`
}

const startTs = computed(() => props.hour[props.course.hour[0] - 1][0])
const endTs = computed(() => props.hour[props.course.hour[1] - 1][1])
const active = computed(() => props.active && props.active >= startTs.value && props.active <= endTs.value)
</script>

<style scoped>

</style>
