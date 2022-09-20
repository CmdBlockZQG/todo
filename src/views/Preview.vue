<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-btn flat round icon="arrow_back" @click="router.back()" />
      <q-toolbar-title>预览日程</q-toolbar-title>
    </q-toolbar>
    <q-tabs>
      <q-route-tab name="0" label="今天" />
      <q-route-tab name="1" label="明天" />
      <q-route-tab name="2" label="后天" />
      <q-route-tab name="3" label="其他" />
    </q-tabs>
  </q-header>
  <q-page-container>
  </q-page-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>

</style>
