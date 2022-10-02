<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-btn flat round icon="arrow_back" @click="leaveWithoutSave" />
      <q-toolbar-title>编辑事项</q-toolbar-title>
    </q-toolbar>
  </q-header>

  <q-page-container>
    <div class="q-gutter-md q-pa-md">
      <q-input outlined v-model="event.name" label="事项标题" />
      <q-input outlined v-model="event.remark" type="textarea" label="备注" />

      <q-field outlined label="日期" stack-label>
        <q-popup-proxy @before-show="proxy = event.day" cover transition-show="scale" transition-hide="scale">
          <q-date v-model="proxy">
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn label="取消" color="primary" flat v-close-popup />
              <q-btn label="确认" color="primary" flat @click="event.day = proxy" v-close-popup />
            </div>
          </q-date>
        </q-popup-proxy>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">{{ event.day }}</div>
        </template>
      </q-field>

      <div class="row">
        <q-field outlined label="开始时间" stack-label class="col">
          <q-popup-proxy @before-show="proxy = event.start" cover transition-show="scale" transition-hide="scale">
            <q-time v-model="proxy">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="取消" color="primary" flat v-close-popup />
                <q-btn label="确认" color="primary" flat @click="event.start = proxy" v-close-popup />
              </div>
            </q-time>
          </q-popup-proxy>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">{{ event.start }}</div>
          </template>
        </q-field>

        <q-field outlined label="结束时间" stack-label class="col q-ml-sm">
          <q-popup-proxy @before-show="proxy = event.end" cover transition-show="scale" transition-hide="scale">
            <q-time v-model="proxy">
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="取消" color="primary" flat v-close-popup />
                <q-btn label="确认" color="primary" flat @click="event.end = proxy" v-close-popup />
              </div>
            </q-time>
          </q-popup-proxy>
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">{{ event.end }}</div>
          </template>
        </q-field>
      </div>

      <q-checkbox v-model="event.autoDel" label="在时间结束后自动删除，不收入“已逾期”" />
      <br>
      <q-btn color="primary" label="提交" @click="submit" />
    </div>
  </q-page-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { date, Dialog } from 'quasar'
import db from '../../service/db.js'
import { numberifyTime, stringifyTime } from '../../service/utils.js'

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

const event = ref({})
const proxy = ref('')

onMounted(async () => {
  const res = await db.getOne('event', _id)
  event.value = {
    _id: res._id,
    name: res.name,
    remark: res.remark,
    day: date.formatDate(res.day, 'YYYY/MM/DD'),
    start: stringifyTime(res.start),
    end: stringifyTime(res.end),
    autoDel: res.autoDel
  }
})

async function submit() {
  const doc = {
    _id: event.value._id,
    name: event.value.name,
    remark: event.value.remark,
    day: new Date(event.value.day).getTime(),
    start: numberifyTime(event.value.start),
    end: numberifyTime(event.value.end),
    autoDel: event.value.autoDel
  }
  await db.putOne('event', doc)
  router.back()
}

</script>

<style scoped>

</style>

