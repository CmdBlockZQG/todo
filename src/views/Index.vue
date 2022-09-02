<template>
  <h1>123123</h1>
  <q-btn color="primary" label="Primary" />
  <q-date v-model="date"></q-date>
</template>

<script setup>
  import { ref } from 'vue'
  let date = ref('2022/9/1')
</script>
