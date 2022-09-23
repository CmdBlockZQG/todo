<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-toolbar-title>事项</q-toolbar-title>
      <q-btn flat round icon="more_vert" >
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="router.push('/event/new')">
              <q-item-section>新建日程</q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="router.push('/event/newR')">
              <q-item-section>新建重复日程</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>

    <q-tabs align="left" v-model="tab">
      <q-tab name="today" label="今日" />
      <q-tab name="expire" label="逾期" />
      <q-tab name="future" label="未来" />
      <q-tab name="repeat" label="重复" />
    </q-tabs>
  </q-header>

  <q-page-container>
    {{ tab }}
  </q-page-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const tab = ref('today')
</script>

<style scoped>

</style>
