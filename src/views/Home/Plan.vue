<template>
  <v-app-bar density="compact">
    <v-toolbar-title>安排</v-toolbar-title>
    <!--
    <template v-slot:append>
      <v-btn icon="mdi-dots-vertical"></v-btn>
    </template>
    -->

    <template v-slot:extension>
      <v-tabs v-model="tabSelect" grow color="primary">
        <v-tab value="plan" @click="router.replace('/plan')">事项</v-tab>
        <v-tab value="event" @click="router.replace('/plan/event')">时点</v-tab>
        <v-tab value="routine" @click="router.replace('/plan/routine')">日常</v-tab>
      </v-tabs>
    </template>
  </v-app-bar>

  <v-main>
    <router-view />
  </v-main>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabSelect = ref(route.meta.tab)
watch(
  () => route.meta.tab,
  tab => tabSelect.value = tab
)
</script>
