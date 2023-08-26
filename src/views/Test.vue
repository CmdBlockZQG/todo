<template>
  <h1>test</h1>
  <div>
    <DatePicker v-model="date"></DatePicker>
  </div>
  {{ date }}
  <div>
    <TimePicker v-model="time"></TimePicker>
  </div>
  {{ time }}
</template>

<script setup>
import { onMounted, ref } from 'vue'
import DatePicker from '../components/DatePicker.vue'
import TimePicker from "../components/TimePicker.vue";

const date = ref(1693152000)
const time = ref(36660)

</script>
