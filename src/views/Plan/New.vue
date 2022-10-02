<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-btn flat round icon="arrow_back" @click="leaveWithoutSave" />
      <q-toolbar-title>新建计划</q-toolbar-title>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { date, Dialog } from 'quasar'
import db from '../../service/db.js'

const router = useRouter()

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

const proxy = ref('')
const plan = ref({
  name: '',
  remark: '',
  hasStart: true,
  startDate: date.formatDate(Date.now(), 'YYYY/MM/DD'),
  startTime: '00:00',
  hasEnd: true,
  endDate: date.formatDate(Date.now(), 'YYYY/MM/DD'),
  endTime: '23:59'
})


async function submit() {
  const doc = {
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
