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
        <q-item-section>课程安排</q-item-section>
      </q-item>
      <q-item clickable v-ripple @click="router.push('/course/hour')">
        <q-item-section avatar>
          <q-icon name="access_time" />
        </q-item-section>
        <q-item-section>小节课时间点</q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon name="date_range" />
        </q-item-section>
        <q-item-section>
          第一教学周周一日期
          <q-popup-proxy @before-show="updateProxy" cover transition-show="scale" transition-hide="scale">
            <q-date v-model="dateProxy" today-btn>
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="取消" color="primary" flat v-close-popup />
                <q-btn label="确认" color="primary" flat @click="save" v-close-popup />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-item-section>
        <q-item-section side>
          <q-item-label caption>{{ termStartStr }}</q-item-label>
        </q-item-section>
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
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import setting from '../../service/setting.js'

  const router = useRouter()

  const date = ref(1661702400000)
  const dateProxy = ref('2022/08/29')

  function dateString(timeStamp) {
    const ts = new Date(timeStamp)
    const y = ts.getFullYear(),
      m = ts.getMonth() + 1,
      d = ts.getDate()
    return `${y}/${m < 10 ? '0' + m : m}/${d < 10 ? '0' + d : d}`
  }

  onMounted(async () => {
    date.value = await setting.get('termStart')
  })

  const termStartStr = computed(() => new Date(date.value).toLocaleDateString())

  async function updateProxy() {
    dateProxy.value = dateString(date.value)
  }

  async function save() {
    date.value = new Date(dateProxy.value).getTime()
    await setting.set('termStart', date.value)
  }
</script>

<style scoped>

</style>
