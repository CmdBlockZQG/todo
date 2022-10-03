<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-btn flat round icon="arrow_back" @click="leaveWithoutSave" />
      <q-toolbar-title>编辑大节课安排</q-toolbar-title>
    </q-toolbar>
  </q-header>
  <q-page-container>
    <div class="q-pa-md">
      <q-btn color="warning" class="full-width q-mb-md" icon="warning" label="查看重要说明" @click="help" />
      <q-btn color="primary" class="full-width q-mb-md" icon="add" label="添加大节课" @click="periods.push('1-2')" />
      <q-markup-table dense class="text-center">
        <thead>
        <tr>
          <th>大节课编号</th>
          <th>小节课</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(period, i) in periods">
          <td>
            {{ i + 1 }}
          </td>
          <td>
            {{ period }}
            <q-popup-edit v-model="periods[i]" buttons v-slot="scope">
              <q-input type="text" v-model="scope.value" dense autofocus @keyup.enter="scope.set" />
            </q-popup-edit>
          </td>
          <td>
            <q-btn flat round color="red" icon="delete" @click="periods.splice(i, 1)" />
          </td>
        </tr>
        </tbody>
      </q-markup-table>
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

const periods = ref([])

onMounted(async () => {
  const res = await setting.get('period')
  periods.value = res.map((t) => t.join('-'))
})

async function submit() {
  await setting.set('period', periods.value.map((t) => {
    const s = t.split('-')
    return [Number(s[0]), Number(s[1])]
  }))
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
      '小节课格式说明：<br>' +
      '横杠（减号）隔开的两个数，表示这个闭区间<br>' +
      '例如小节课 2-4 第二到第四小节课，共三个学时<br>' +
      '<br>' +
      '不要写奇怪的东西，没做容错。请自行核对'
  })
}

</script>

<style scoped>

</style>
