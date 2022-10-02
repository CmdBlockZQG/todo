<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-btn flat round icon="arrow_back" @click="leaveWithoutSave" />
      <q-toolbar-title>新建重复事项</q-toolbar-title>
    </q-toolbar>
    <q-tabs v-model="tab">
      <q-tab name="basic" label="基本信息" />
      <q-tab name="arr" label="事项计划" />
    </q-tabs>
  </q-header>

  <q-page-container>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="basic">
          <div class="q-gutter-md">
            <q-input outlined v-model="event.name" label="事项标题" />
            <q-input outlined v-model="event.remark" type="textarea" label="备注" />

            <q-select outlined emit-value map-options v-model="event.type" :options="typeSelect" label="重复周期" />

            <div v-if="event.type === 'xd'" class="row">
              <q-field outlined label="第一周期第一天日期" stack-label class="col">
                <q-popup-proxy @before-show="proxy = event.startDay" cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="proxy">
                    <div class="row items-center justify-end q-gutter-sm">
                      <q-btn label="取消" color="primary" flat v-close-popup />
                      <q-btn label="确认" color="primary" flat @click="event.startDay = proxy" v-close-popup />
                    </div>
                  </q-date>
                </q-popup-proxy>
                <template v-slot:control>
                  <div class="self-center full-width no-outline" tabindex="0">{{ event.startDay }}</div>
                </template>
              </q-field>

              <q-input outlined v-model="event.cycle" type="number" label="周期天数" class="col q-ml-sm"/>
            </div>

            <q-checkbox v-model="event.autoDel" label="在时间结束后自动删除，不收入“已逾期”" />
            <br>
            <div>记得编辑事项计划后再提交哦~</div>
            <q-btn color="primary" label="提交" @click="submit" />
          </div>
        </q-tab-panel>
        <q-tab-panel name="arr">
          <q-btn color="warning" class="full-width q-mb-md" icon="warning" label="查看重要说明" @click="help" />
          <q-btn color="primary" class="full-width q-mb-md" icon="add" label="添加计划" @click="addPlan" />

          <q-markup-table dense class="text-center">
            <thead>
              <tr>
                <th>第几天</th>
                <th>开始时刻</th>
                <th>结束时刻</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="plan in event.plan">
                <td>
                  {{ plan.day }}
                  <q-popup-edit v-model.number="plan.day" buttons v-slot="scope">
                    <q-input type="number" v-model.number="scope.value" dense autofocus @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>
                <td>
                  {{ plan.start }}
                  <q-popup-edit v-model="plan.start" buttons v-slot="scope">
                    <q-input type="text" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>
                <td>
                  {{ plan.end }}
                  <q-popup-edit v-model="plan.end" buttons v-slot="scope">
                    <q-input type="text" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
                  </q-popup-edit>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-tab-panel>
      </q-tab-panels>
  </q-page-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog, date } from 'quasar'
import db from '../../service/db.js'
import { numberifyTime } from '../../service/utils.js'

const router = useRouter()

const tab = ref('basic')

const proxy = ref('')

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

const typeSelect = [
  { label: '每日', value: 'd' },
  { label: '每x日', value: 'xd' },
  { label: '每周', value: 'w' },
  { label: '每月', value: 'm' },
  { label: '单周', value: 'ow' }, // odd week
  { label: '双周', value: 'ew' }, // even week
]

function help() {
  Dialog.create({
    title: '重要说明',
    html: true,
    message:
      '“第几天”说明：<br>' +
      '表示在周期中是第几天。如果周期是月，那么第3天就是每月3日，如果周期是周，那么第3天就是每周星期三<br>' +
      '<br>' +
      '开始/结束时刻格式说明：<br>' +
      '<b>半角</b>冒号隔开，表示一个时刻，<b>24小时制</b><br>' +
      '<br>' +
      '不要写奇怪的东西，没做容错。请新建完成后自行核对'
  })
}

const event = ref({
  name: '',
  remark: '',
  type: 'w',
  autoDel: false,
  startDay: date.formatDate(Date.now(), 'YYYY/MM/DD'),
  cycle: 1,
  plan: []
})

function addPlan() {
  event.value.plan.push({
    day: 1,
    start: '00:00',
    end: '23:59'
  })
}

async function submit() {
  const doc = {
    name: event.value.name,
    remark: event.value.remark,
    autoDel: event.value.autoDel,
    type: event.value.type,
    plan: event.value.plan.map((x) => {
      const d = (Number(x.day) - 1) * 86400 * 1000
      return [d + numberifyTime(x.start), d + numberifyTime(x.end)]
    })
  }
  if (doc.type === 'xd') {
    doc.startDay = new Date(event.value.startDay).getTime()
    doc.cycle = event.value.cycle
  }
  await db.putOne('eventR', doc)
  router.back()
}

</script>

<style scoped>

</style>
