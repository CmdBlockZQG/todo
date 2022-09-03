<template>
  <router-view />

  <q-footer elevated>
    <q-tabs
      v-model="tabSelect"
      dense
      class="bg-white text-primary"
    >
      <q-tab name="day" icon="today" label="今日" @click="router.replace('/')" />
      <q-tab name="event" icon="fact_check" label="事项" @click="router.replace('/event')" />
      <q-tab name="plan" icon="moving" label="计划" @click="router.replace('/plan')" />
      <q-tab name="setting" icon="settings" label="设置" @click="router.replace('/setting')" />
    </q-tabs>
  </q-footer>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import { useRouter, useRoute } from 'vue-router'

  const router = useRouter()
  const route = useRoute()

  let tabSelect = ref(route.meta.navActive)

  watch(
    () => route.meta.navActive,
    tab => {
      tabSelect.value = tab
    }
  )

</script>

<style scoped>

</style>
