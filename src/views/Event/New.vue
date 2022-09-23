<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-btn flat round icon="arrow_back" @click="leaveWithoutSave" />
      <q-toolbar-title>新建事项</q-toolbar-title>
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

      <q-field outlined label="开始时间" stack-label>
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

      <q-field outlined label="结束时间" stack-label>
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

      <q-checkbox v-model="event.expire" label="在时间结束后收入“已逾期”" />
    </div>
  </q-page-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { date, Dialog } from 'quasar'

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

const event = ref({
  name: '',
  remark: '',
  day: date.formatDate(Date.now(), 'YYYY/MM/DD'),
  start: date.formatDate(Date.now(), 'HH:mm'),
  end: date.formatDate(Date.now(), 'HH:mm'),
  expire: false
})

const proxy = ref('')

</script>

<style scoped>

</style>
