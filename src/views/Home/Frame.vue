<template>
  <RouterView/>
  <v-bottom-navigation grow v-model="tabSelect" color="primary">
    <v-btn value="today">
      <v-icon>mdi-home</v-icon>
      今日
    </v-btn>
    <v-btn value="work">
      <v-icon>mdi-file-edit-outline</v-icon>
      作业
    </v-btn>
    <v-btn value="plan">
      <v-icon>mdi-text-box-check-outline</v-icon>
      安排
    </v-btn>
    <v-btn value="overview">
      <v-icon>mdi-view-dashboard</v-icon>
      总览
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { ref } from 'vue'
const tabSelect = ref('today')
</script>