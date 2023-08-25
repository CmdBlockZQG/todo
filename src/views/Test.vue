<template>
  <h1>test</h1>
  <div>
    <DatePicker v-model="date"></DatePicker>
  </div>
  {{ date }}
</template>

<script setup>
import { onMounted, ref } from 'vue'
import DatePicker from '../components/DatePicker.vue'

const date = ref(1693152000)

</script>
