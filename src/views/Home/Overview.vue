<template>
  <v-app-bar density="compact">
    <v-toolbar-title>总览</v-toolbar-title>
<!--    <template v-slot:append>-->
<!--      <v-menu>-->
<!--        <template v-slot:activator="{ props }">-->
<!--          <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>-->
<!--        </template>-->
<!--        <v-list>-->
<!--          <v-list-item link>-->
<!--            <v-list-item-title-->
<!--              @click="toggleCfg('autoHideWeekend')"-->
<!--            >-->
<!--              {{ cfg.autoHideWeekend ? '关闭' : '打开' }}自动隐藏周末-->
<!--            </v-list-item-title>-->
<!--          </v-list-item>-->
<!--          <v-list-item link>-->
<!--            <v-list-item-title-->
<!--              @click="toggleCfg('autoHideN')"-->
<!--            >-->
<!--              {{ cfg.autoHideN ? '关闭' : '打开' }}自动隐藏晚大节课-->
<!--            </v-list-item-title>-->
<!--          </v-list-item>-->
<!--        </v-list>-->
<!--      </v-menu>-->
<!--    </template>-->

    <!-- <template v-slot:extension>
      <v-tabs v-model="tabSelect" grow color="primary">
        <v-tab value="course" @click="router.replace('/overview')">课表</v-tab>
        <v-tab value="schedule" @click="router.replace('/overview/schedule')">安排</v-tab>
      </v-tabs>
    </template> -->
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

// const cfg = JSON.parse(window.localStorage.overviewCfg)
// function toggleCfg(k) {
//   cfg[k] = !cfg[k]
//   window.location.reload()
// }

</script>
