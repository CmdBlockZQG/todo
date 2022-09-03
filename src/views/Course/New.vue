<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-btn flat round icon="arrow_back" @click="leaveWithoutSave" />
      <q-toolbar-title>新建课程</q-toolbar-title>
    </q-toolbar>
    <q-tabs v-model="tab">
      <q-tab name="basic" label="基本信息" />
      <q-tab name="arr" label="课程安排" />
    </q-tabs>
  </q-header>

  <q-page-container>
    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="basic">
        <div class="q-gutter-md">
          <q-input outlined v-model="course.id" label="课程号" />
          <q-input outlined v-model="course.name" label="课程名" />
          <q-input outlined v-model="course.remark" type="textarea" label="课程备注" />
          <div>记得编辑课程安排后再提交哦~</div>
          <q-btn color="primary" label="提交" @click="submit" />
        </div>
      </q-tab-panel>
      <q-tab-panel name="arr">
        <q-btn color="warning" class="full-width q-mb-md" icon="warning" label="查看重要说明" @click="help" />
        <q-btn color="primary" class="full-width q-mb-md" icon="add" label="添加安排" @click="addArr" />
        <q-table
          :columns="columns"
          row-key="name"
          :rows="arr"
          :rows-per-page-options="[0]"
          hide-bottom
          dense
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="week" :props="props">
                {{ props.row.week }}
                <q-popup-edit v-model="props.row.week" v-slot="scope" buttons>
                  <q-input v-model="scope.value" dense autofocus counter />
                </q-popup-edit>
              </q-td>
              <q-td key="day" :props="props">
                {{ props.row.day }}
                <q-popup-edit v-model="props.row.day" v-slot="scope" buttons>
                  <q-input v-model="scope.value" dense autofocus counter />
                </q-popup-edit>
              </q-td>
              <q-td key="hour" :props="props">
                {{ props.row.hour }}
                <q-popup-edit v-model="props.row.hour" v-slot="scope" buttons>
                  <q-input v-model="scope.value" dense autofocus counter />
                </q-popup-edit>
              </q-td>
              <q-td key="place" :props="props">
                {{ props.row.place }}
                <q-popup-edit v-model="props.row.place" v-slot="scope" buttons>
                  <q-input v-model="scope.value" dense autofocus counter />
                </q-popup-edit>
              </q-td>
              <q-td key="op" :props="props">
                <q-btn flat round color="red" icon="delete" @click="delArr(props.pageIndex)" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-tab-panel>
    </q-tab-panels>
  </q-page-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'quasar'
import { addCourse } from '../../service/course.js'

const router = useRouter()

const tab = ref('basic')

const course = ref({
  id: '',
  name: '',
  remark: ''
})

const columns = [
  { name: 'week', label: '教学周', field: 'week', align: 'center' },
  { name: 'day', label: '星期', field: 'day', align: 'center' },
  { name: 'hour', label: '小节课', field: 'hour', align: 'center' },
  { name: 'place', label: '地点', field: 'place', align: 'center' },
  { name: 'op', label: '操作' }
]
const arr = ref([])

function addArr() {
  arr.value.push({
    week: '1-2',
    day: '1',
    hour: '1-2',
    place: '高B101'
  })
}

function delArr(i) {
  arr.value.splice(i, 1)
}

async function submit() {
  await addCourse(course.value, arr.value)
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
      '教学周格式说明：<br>' +
      '半角逗号隔开多个表述，每个表述可以是单纯的一个数字，表示本身， 也可以是用横杠（减号）隔开的两个数，表示这两个数及其中间的所有数<br>' +
      '例如教学周 1,3-8,10 表示第一周，三到八周和第十周<br>' +
      '<br>' +
      '小节课格式说明：<br>' +
      '横杠（减号）隔开的两个数，表示这个闭区间<br>' +
      '例如小节课 2-4 第二到第四小节课，共三个学时<br>' +
      '<br>' +
      '不要写奇怪的东西，没做容错。请新建完成后自行核对'
  })
}

</script>

<style scoped>

</style>
