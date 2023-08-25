<template>
  <router-view />
  <v-bottom-navigation grow color="primary" v-model="tabSelect">
    <v-btn value="today" @click="router.replace('/')">
      <v-icon>mdi-calendar-outline</v-icon>
      今日
    </v-btn>
    <v-btn value="work" @click="router.replace('/work')">
      <v-icon>mdi-file-edit-outline</v-icon>
      作业
    </v-btn>
    <v-btn value="plan" @click="router.replace('/plan')">
      <v-icon>mdi-text-box-check-outline</v-icon>
      安排
    </v-btn>
    <v-btn value="overview" @click="router.replace('/overview')">
      <v-icon>mdi-view-dashboard-outline</v-icon>
      总览
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabSelect = ref(route.meta.nav)

watch(
  () => route.meta.nav,
  tab => tabSelect.value = tab
)

</script>
