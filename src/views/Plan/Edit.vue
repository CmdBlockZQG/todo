<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-btn flat round icon="arrow_back" @click="leaveWithoutSave" />
      <q-toolbar-title>编辑计划</q-toolbar-title>
    </q-toolbar>
  </q-header>

  <q-page-container>
    <div class="q-gutter-md q-pa-md">
      <q-input outlined v-model="plan.name" label="计划标题" />
      <q-input outlined v-model="plan.remark" type="textarea" label="备注" />

      <q-checkbox v-model="plan.hasStart" label="设置开始时间" />
      <br>
      <div v-if="plan.hasStart" class="row">
        <q-field outlined label="开始日期" stack-label class="col">
          <q-popup-proxy @before-show="proxy = plan.startDate" cover transition-show="scale" transition-hide="scale">
            <q-date v-model="proxy">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="取消" color="primary" flat v-close-popup />
                <q-btn label="确认" color="primary" flat @click="plan.startDate = proxy" v-close-popup />
              </div>
            </q-date>
          </q-popup-proxy>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">{{ plan.startDate }}</div>
          </template>
        </q-field>

        <q-field outlined label="开始时刻" stack-label class="col q-ml-sm">
          <q-popup-proxy @before-show="proxy = plan.startTime" cover transition-show="scale" transition-hide="scale">
            <q-time v-model="proxy">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="取消" color="primary" flat v-close-popup />
                <q-btn label="确认" color="primary" flat @click="plan.startTime = proxy" v-close-popup />
              </div>
            </q-time>
          </q-popup-proxy>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">{{ plan.startTime }}</div>
          </template>
        </q-field>
      </div>

      <q-checkbox v-model="plan.hasEnd" label="设置结束时间" />
      <br>
      <div v-if="plan.hasEnd" class="row">
        <q-field outlined label="结束日期" stack-label class="col">
          <q-popup-proxy @before-show="proxy = plan.endDate" cover transition-show="scale" transition-hide="scale">
            <q-date v-model="proxy">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="取消" color="primary" flat v-close-popup />
                <q-btn label="确认" color="primary" flat @click="plan.endDate = proxy" v-close-popup />
              </div>
            </q-date>
          </q-popup-proxy>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">{{ plan.endDate }}</div>
          </template>
        </q-field>

        <q-field outlined label="结束时刻" stack-label class="col q-ml-sm">
          <q-popup-proxy @before-show="proxy = plan.endTime" cover transition-show="scale" transition-hide="scale">
            <q-time v-model="proxy">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="取消" color="primary" flat v-close-popup />
                <q-btn label="确认" color="primary" flat @click="plan.endTime = proxy" v-close-popup />
              </div>
            </q-time>
          </q-popup-proxy>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">{{ plan.endTime }}</div>
          </template>
        </q-field>
      </div>

      <q-btn color="primary" label="提交" @click="submit" />
    </div>
  </q-page-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { date, Dialog } from 'quasar'
import db from '../../service/db.js'
import { stringifyTime } from '../../service/utils.js'

const router = useRouter()
const route = useRoute()

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

let _id = route.params._id

const proxy = ref('')
const plan = ref({})

onMounted(async () => {
  let res = await db.getOne('plan', _id)
  const hasStart = res.start !== 0,
        hasEnd = res.end !== 4000000000000
  if (!hasStart) res.start = new Date().getTime()
  if (!hasEnd) res.end = new Date().getTime()
  plan.value = {
    _id: res._id,
    name: res.name,
    remark: res.remark,
    hasStart: hasStart,
    startDate: date.formatDate(res.start, 'YYYY/MM/DD'),
    startTime: date.formatDate(res.start, 'HH:mm'),
    hasEnd: hasEnd,
    endDate: date.formatDate(res.end, 'YYYY/MM/DD'),
    endTime: date.formatDate(res.end, 'HH:mm'),
  }
})

async function submit() {
  const doc = {
    _id: plan.value._id,
    name: plan.value.name,
    remark: plan.value.remark,
    start: plan.value.hasStart ? new Date(plan.value.startDate + ' ' + plan.value.startTime).getTime() : 0,
    end: plan.value.hasEnd ? new Date(plan.value.endDate + ' ' + plan.value.endTime).getTime() : 4000000000000
  }
  await db.putOne('plan', doc)
  router.back()
}

</script>

<style scoped>

</style>
