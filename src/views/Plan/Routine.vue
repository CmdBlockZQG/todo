<template>
  <div class="overflow-hidden bg-grey-lighten-3 h-100" style="padding-bottom: 96px">
    <v-sheet
      v-for="(routine, i) in routines"
      @click="openOptDialog(i)"
      v-ripple
      class="mt-2 pa-3"
    >
      <div class="text-h5">{{ routine.title }}</div>
      <div>{{ routine.content }}</div>
      <div class="text-caption d-flex align-center">
        <v-icon icon="mdi-clock-outline"></v-icon>
        <div class="ml-1 text-body-2">
          {{ arrDesc[i] }}
        </div>
      </div>
    </v-sheet>
  </div>

  <div class="float-btn">
    <v-btn
      icon="mdi-plus"
      size="x-large"
      color="primary"
      class="elevation-8"
      @click="openEditDialog(-1)"
    ></v-btn>
  </div>

  <v-dialog
    v-model="editDialogOpen"
    width="400"
    persistent
  >
    <v-card>
      <v-card-title><span class="text-h5">{{ curIndex === -1 ? '添加' : '编辑' }}日常</span></v-card-title>
      <div class="px-4">
        <v-text-field
          label="标题"
          v-model="editDialog.title"
          hide-details="auto"
          density="compact"
        ></v-text-field>
        <v-textarea
          label="内容"
          v-model="editDialog.content"
          hide-details="auto"
          density="compact"
        ></v-textarea>

        <v-select
          v-model="editDialog.type"
          hide-details="auto"
          density="compact"
          :items="typeList"
          label="日常类型"
          v-if="editDialog.type !== 'xd'"
        ></v-select>
        <template v-else>
          <div class="d-flex">
            <v-select
              v-model="editDialog.type"
              hide-details="auto"
              density="compact"
              :items="typeList"
              label="日常类型"
              style="width: 50%;"
            ></v-select>
            <v-text-field
              label="周期天数"
              v-model.number="editDialog.len"
              type="number"
              hide-details="auto"
              density="compact"
              style="width: 50%;"
            ></v-text-field>
          </div>
          <div class="mb-1">周期开始于：<DatePicker v-model="editDialog.startDate"></DatePicker></div>
        </template>

        <v-textarea
          label="日常安排"
          v-model="editDialog.arr"
          hint="每行表示一个安排，包含四个空格隔开的部分。第一部分为一个整数x，表示日常发生在周期的第x天；接下来两个部分为两个时刻，分别表示开始时间和结束时间。时刻形如08:00，24时制，注意使用半角冒号。最后一个部分为备注。开始结束时间可省略，默认为缺省值(0:00~23:59)。"
          persistent-hint
          density="compact"
        ></v-textarea>
      </div>
      <v-card-actions>
        <div class="spacer"></div>
        <v-btn color="primary" @click="editDialogOpen = false">取消</v-btn>
        <v-btn color="primary" variant="flat" @click="confirmEditDialog">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="optDialogOpen"
    width="400"
    persistent
  >
    <v-card>
      <v-card-title><span class="text-h5">{{ curRoutine.title }}</span></v-card-title>
      <v-card-text>
        {{ curRoutine.content }}
        <div class="text-caption text-disabled mt-1" v-html="curRoutineDesc">
        </div>
      </v-card-text>
      <div class="pa-2">
        <v-btn block variant="text" @click="optDialogOpen = false, openEditDialog(curIndex)">编辑</v-btn>
        <v-btn block variant="text" class="mt-1" @click="delRoutine">删除</v-btn>
        <v-btn block variant="text" class="mt-1" @click="optDialogOpen = false">取消</v-btn>
      </div>
    </v-card>
  </v-dialog>

</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import dialog from '../../utils/dialog.js'
import genId from '../../utils/genId.js'
import time from '../../utils/time'
import DatePicker from '../../components/DatePicker.vue'
const WeekdayChar = ['', '一', '二', '三', '四', '五', '六', '日']

const LS = window.localStorage
const today = time.today()

const routineIdList = ref([])
if (LS.routine) {
  routineIdList.value = JSON.parse(LS.routine)
} else {
  LS.routine = '[]'
}

const routines = ref([])
function updateRoutines() {
  routines.value = routineIdList.value.map(id => JSON.parse(LS[id]))
}
onMounted(updateRoutines)
watchEffect(updateRoutines)


const arrDesc = computed(() => {
  return routines.value.map(x => {
    if (x.arr.length === 0) {
      return '无安排'
    }
    let flag = true
    const dayList = x.arr.map(y => y.day)
    for (let i = 1; i < x.arr.length; ++i) {
      if (x.arr[i].start !== x.arr[0].start || x.arr[i].end !== x.arr[0].end) {
        flag = false
        break
      }
    }
    let res = ''
    switch (x.type) {
      case 'w':
        res = `每周${dayList.map(x => WeekdayChar[x]).join('、')} `
        break
      case 'm':
        res = `每月${dayList.join('、')}日 `
        break
      case 'xd':
        if (x.arr.length === 1) {
          res = `每${x.len}天一次 `
        } else {
          res += `每${x.len}天的第${dayList.join('、')}天 `
        }
        break
      case 'ow':
        res = `单周周${dayList.map(x => WeekdayChar[x]).join('、')} `
        break
      case 'ew':
        res = `双周周${dayList.map(x => WeekdayChar[x]).join('、')} `
        break
    }

    if (flag) {
      res += `${time.timeTsToStr(x.arr[0].start)} ~ ${time.timeTsToStr(x.arr[0].end)}`
    }

    return res
  })
})

const typeList = [
  { title: '每周', value: 'w' },
  { title: '每月', value: 'm' },
  { title: '每x日', value: 'xd' },
  { title: '单周', value: 'ow' },
  { title: '双周', value: 'ew' },
]

const editDialogOpen = ref(false)
const curIndex = ref(-1)
const curRoutine = computed(() => {
  return routines.value[curIndex.value]
})
const curRoutineDesc = computed(() => {
  const x = curRoutine.value
  let res = '周期：'
  if (x.type === 'xd') {
    res += `${time.dateTsToStr(x.startDate)}开始 每${x.len}天<br>`
  } else {
    const map = {
      'w': '每周',
      'm': '每月',
      'ow': '每单周',
      'ew': '每双周'
    }
    res += `${map[x.type]}<br>`
  }
  res += x.arr.map(y => `第${y.day}天 ${time.timeTsToStr(y.start)} ~ ${time.timeTsToStr(y.end)} ${y.remark}`).join('<br>')
  return res
})
const editDialog = ref({
  title: '',
  content: '',
  type: 'w', // w m ow ew xd
  startDate: 0,
  len: 2,
  arr: ''
})
function openEditDialog(index) {
  curIndex.value = index
  if (index === -1) {
    editDialog.value = {
      title: '',
      content: '',
      type: 'w',
      startDate: today,
      len: 2,
      arr: ''
    }
  } else {
    editDialog.value = {
      title: curRoutine.value.title,
      content: curRoutine.value.content,
      type: curRoutine.value.type,
      startDate: curRoutine.value.startDate || today,
      len: curRoutine.value.len || 2,
      arr: curRoutine.value.arr.map(x => x.start === 0 && x.end === 86340 ? `${x.day} ${x.remark}` : `${x.day} ${time.timeTsToStr(x.start)} ${time.timeTsToStr(x.end)} ${x.remark}`).join('\n')
    }
  }

  editDialogOpen.value = true
}
function confirmEditDialog() {
  const arr = []
  for (const line of editDialog.value.arr.split('\n')) {
    const tl = line.split(' ')
    if (tl.length === 1 || tl.length === 2) {
      arr.push({
        day: Number(tl[0]),
        start: 0,
        end: 86340,
        remark: tl[1] ? tl[1] : ''
      })
    } else if (tl.length === 3 || tl.length === 4) {
      arr.push({
        day: Number(tl[0]),
        start: time.timeStrToTs(tl[1]),
        end: time.timeStrToTs(tl[2]),
        remark: tl[3] ? tl[3] : ''
      })
    }
  }
  let res
  if (editDialog.value.type === 'xd') {
    res = {
      title: editDialog.value.title,
      content: editDialog.value.content,
      type: editDialog.value.type,
      startDate: editDialog.value.startDate,
      len: editDialog.value.len,
      arr: arr
    }
  } else {
    res = {
      title: editDialog.value.title,
      content: editDialog.value.content,
      type: editDialog.value.type,
      arr: arr
    }
  }
  if (curIndex.value === -1) {
    const id = genId()
    LS[id] = JSON.stringify(res)
    routineIdList.value.unshift(id)
    LS.routine = JSON.stringify(routineIdList.value)
  } else {
    LS[routineIdList.value[curIndex.value]] = JSON.stringify(res)
    updateRoutines()
  }
  editDialogOpen.value = false
}

const optDialogOpen = ref(false)
function openOptDialog(index) {
  curIndex.value = index
  optDialogOpen.value = true
}
function delRoutine() {
  optDialogOpen.value = false
  dialog.confirm('删除日常', `确认删除<b>${curRoutine.value.title}</b>吗？`, () => {
    delete LS[routineIdList.value[curIndex.value]]
    routineIdList.value.splice(curIndex.value, 1)
    LS.routine = JSON.stringify(routineIdList.value)
  })
}

</script>

<style scoped>
.float-btn {
  position: fixed;
  right: 16px;
  bottom: 72px;
}
</style>
