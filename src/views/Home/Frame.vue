<template>
  <q-layout view="hHh lpR fFf">
    <router-view />

    <q-footer elevated>
      <q-tabs
        v-model="tabSelect"
        dense
        class="bg-white text-primary"
      >
        <q-tab name="day" icon="today" label="今日" @click="router.push('/')" />
        <q-tab name="event" icon="fact_check" label="事项" @click="router.push('/event')" />
        <q-tab name="plan" icon="moving" label="计划" @click="router.push('/plan')" />
        <q-tab name="setting" icon="settings" label="设置" @click="router.push('/setting')" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter()
  const route = useRoute()

  let tabSelect = ref('day')

  watch(
    () => route.meta.navActive,
    newTab => {
      tabSelect.value = newTab
    }
  )

</script>

<style scoped>

</style>
