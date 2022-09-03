<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-toolbar-title>设置</q-toolbar-title>
      <q-space />
      <q-btn flat round icon="info" />
    </q-toolbar>
  </q-header>

  <q-page-container>
    <q-list>
      <q-item-label header>课表</q-item-label>
      <q-item clickable v-ripple @click="router.push('/course')">
        <q-item-section avatar>
          <q-icon name="dashboard" />
        </q-item-section>
        <q-item-section>录入课程安排</q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="access_time" />
        </q-item-section>
        <q-item-section>编辑学时时间点</q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="date_range" />
        </q-item-section>
        <q-item-section>设定学期开始日期</q-item-section>
      </q-item>

      <q-item-label header>数据</q-item-label>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="download" />
        </q-item-section>
        <q-item-section>备份数据</q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="restore" />
        </q-item-section>
        <q-item-section>恢复备份</q-item-section>
      </q-item>

      <q-item-label header>其他</q-item-label>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="info" />
        </q-item-section>
        <q-item-section>关于</q-item-section>
      </q-item>
    </q-list>
  </q-page-container>
</template>

<script setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()
</script>

<style scoped>

</style>
