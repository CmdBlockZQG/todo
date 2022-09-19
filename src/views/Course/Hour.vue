<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-btn flat round icon="arrow_back" @click="leaveWithoutSave" />
      <q-toolbar-title>编辑小节课时间点</q-toolbar-title>
    </q-toolbar>
  </q-header>
  <q-page-container>
    <div class="q-pa-md">
      <q-btn color="warning" class="full-width q-mb-md" icon="warning" label="查看重要说明" @click="help" />
      <q-btn color="primary" class="full-width q-mb-md" icon="add" label="添加小节课" @click="addHour" />
      <q-table
        :columns="columns"
        row-key="name"
        :rows="hours"
        :rows-per-page-options="[0]"
        hide-bottom
        dense
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="hour" :props="props">
              {{ props.pageIndex + 1 }}
            </q-td>
            <q-td key="start" :props="props">
              {{ props.row.start }}
              <q-popup-edit v-model="props.row.start" v-slot="scope" buttons>
                <q-input v-model="scope.value" dense autofocus counter />
              </q-popup-edit>
            </q-td>
            <q-td key="end" :props="props">
              {{ props.row.end }}
              <q-popup-edit v-model="props.row.end" v-slot="scope" buttons>
                <q-input v-model="scope.value" dense autofocus counter />
              </q-popup-edit>
            </q-td>
            <q-td key="op" :props="props">
              <q-btn flat round color="red" icon="delete" @click="delHour(props.pageIndex)" />
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-btn class="q-mt-md" color="primary" label="提交" @click="submit" />
    </div>
  </q-page-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'quasar'

import setting from '../../service/setting.js'

const router = useRouter()

const columns = [
  { name: 'hour', label: '小节课编号', field: 'hour', align: 'center' },
  { name: 'start', label: '开始时间', field: 'start', align: 'center' },
  { name: 'end', label: '结束时间', field: 'end', align: 'center' },
  { name: 'op', label: '操作' }
]

const hours = ref([{ start: '8:00', end: '8:45' }, { start: '8:00', end: '8:45' }])

function stringifyTime(ts) {
  ts /= 1000
  const h = Math.floor(ts / 3600)
  ts %= 3600
  const m = Math.floor(ts / 60)
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`
}

onMounted(async () => {
  const res = await setting.get('hour')
  console.log(JSON.stringify(res))
  hours.value = res.map((t) => { return { start: stringifyTime(t[0]), end: stringifyTime(t[1]) } })
})

function addHour() {
  hours.value.push({ start: '8:00', end: '8:45' })
}

function delHour(i) {
  hours.value.splice(i, 1)
}

function numberifyTime(str) {
  const res = str.split(':')
  return (res[0] * 3600 + res[1] * 60) * 1000
}

async function submit() {
  await setting.set('hour', hours.value.map((t) => [numberifyTime(t.start), numberifyTime(t.end)]))
  router.back()
}

function leaveWithoutSave() {
  Dialog.create({
    title: '确定返回？',
    message: '已经做出的更改将不会保存',
    cancel: true,
    persistent: true
  }).onOk(() => {
    router.back()
  })
}

function help() {
  Dialog.create({
    title: '重要说明',
    html: true,
    message:
      '时间格式说明：<br>' +
      '用<b>半角</b>冒号隔开的小时和分钟，表示当天的时刻。使用<b>24小时</b>制！前导0随意。<br>' +
      '<br>' +
      '不要写奇怪的东西，没做容错。请自行核对'
  })
}

</script>

<style scoped>

</style>
