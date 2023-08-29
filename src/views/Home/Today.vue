<template>
  <v-app-bar density="compact">
    <v-app-bar-title>
      {{ time.dateTsToStr(today, '-', false) }}
      {{ time.dateTsToWeekdayStr(today) }}
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn icon="mdi-calendar-month-outline"></v-btn>
    </template>
  </v-app-bar>
  <v-main>
    <div class="overflow-hidden bg-grey-lighten-3 h-100">
    </div>
  </v-main>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import dialog from '@/utils/dialog.js'
import genId from '@/utils/genId.js'
import time from '@/utils/time'

const today = time.today()
const curTime = time.curTime()



</script>
