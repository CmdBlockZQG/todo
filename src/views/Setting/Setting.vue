<template>
  <v-app-bar density="compact">
    <template v-slot:prepend>
      <v-btn icon="mdi-arrow-left" @click="router.back()"></v-btn>
    </template>
    <v-app-bar-title>设置</v-app-bar-title>
    <template v-slot:append>
      <v-btn icon="mdi-information-outline" @click="showAbout"></v-btn>
    </template>
  </v-app-bar>
  <v-main>
    <v-list>
      <v-list-subheader>课程</v-list-subheader>
      <v-list-item link @click="router.push('/setting/course')">
        <v-list-item-title>课程安排</v-list-item-title>
        <template v-slot:prepend>
          <v-icon icon="mdi-view-dashboard-outline"></v-icon>
        </template>
      </v-list-item>
      <v-list-item link @click="openEditHourDialog">
        <v-list-item-title>小节课时间点</v-list-item-title>
        <template v-slot:prepend>
          <v-icon icon="mdi-clock-outline"></v-icon>
        </template>
      </v-list-item>
      <v-list-item link @click="openEditPeriodDialog">
        <v-list-item-title>大节课时间范围</v-list-item-title>
        <template v-slot:prepend>
          <v-icon icon="mdi-timelapse"></v-icon>
        </template>
      </v-list-item>
      <v-list-item link @click="openEditOrigDialog">
        <v-list-item-title>第一教学周周一日期</v-list-item-title>
        <template v-slot:prepend>
          <v-icon icon="mdi-calendar-range-outline"></v-icon>
        </template>
        <template v-slot:append>
          <span class="text-caption">{{ time.dateTsToStr(orig) }}</span>
        </template>
      </v-list-item>
      <v-list-subheader>数据</v-list-subheader>
      <v-list-item link @click="">
        <template v-slot:prepend>
          <v-icon icon="mdi-export"></v-icon>
        </template>
        <v-list-item-title>导出</v-list-item-title>
      </v-list-item>
      <v-list-item link @click="">
        <template v-slot:prepend>
          <v-icon icon="mdi-import"></v-icon>
        </template>
        <v-list-item-title>导入</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-main>

  <!-- 编辑第一教学周周一日期Dialog -->
  <v-dialog
    v-model="editOrigOpen"
    width="400"
  >
    <v-card>
      <v-card-title><span class="text-h5">编辑第一教学周周一日期</span></v-card-title>
      <v-card-text>
        <v-text-field
          label="日期"
          v-model="editOrigProxy"
          hint="用-(减号)隔开的完整日期,如2023-2-13"
          persistent-hint
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <div class="spacer"></div>
        <v-btn color="primary" @click="editOrigOpen = false">取消</v-btn>
        <v-btn color="primary" variant="flat" @click="confirmEditOrig">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 编辑小节课时间点Dialog -->
  <v-dialog
    v-model="editHourOpen"
    width="400"
  >
    <v-card>
      <v-card-title><span class="text-h5">编辑小节课时间点</span></v-card-title>
      <v-card-text>
        <v-textarea
          label="小节课时间点"
          v-model="editHourProxy"
          hint="一行表示一小节课，包含两个空格隔开的时刻，分别表示小节课的上课下课时间。时刻形如08:00，注意使用半角冒号。"
          persistent-hint
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <div class="spacer"></div>
        <v-btn color="primary" @click="editHourOpen = false">取消</v-btn>
        <v-btn color="primary" variant="flat" @click="confirmEditHour">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 编辑大节课时间范围Dialog -->
  <v-dialog
    v-model="editPeriodOpen"
    width="400"
  >
    <v-card>
      <v-card-title><span class="text-h5">编辑大节课时间范围</span></v-card-title>
      <v-card-text>
        <v-textarea
          label="大节课时间范围"
          v-model="editPeriodProxy"
          hint="一行表示一大节课，包含两个空格隔开的数字，表示这个大节课包含的第一节和最后一节小节课。"
          persistent-hint
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <div class="spacer"></div>
        <v-btn color="primary" @click="editPeriodOpen = false">取消</v-btn>
        <v-btn color="primary" variant="flat" @click="confirmEditPeriod">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import time from '../../utils/time.js'
import dialog from '../../utils/dialog.js'

const router = useRouter()
const LS = window.localStorage

const orig = ref(Number(LS.orig))
const editOrigOpen = ref(false)
const editOrigProxy = ref('')
function openEditOrigDialog() {
  editOrigProxy.value = time.dateTsToStr(orig.value)
  editOrigOpen.value = true
}
function confirmEditOrig() {
  orig.value = time.dateStrToTs(editOrigProxy.value)
  LS.orig = orig.value
  editOrigOpen.value = false
}

const editHourOpen = ref(false)
const editHourProxy = ref('')
function openEditHourDialog() {
  const obj = JSON.parse(LS.hour)
  let res = ''
  for (const line of obj) {
    res += time.timeTsToStr(line[0]) + ' ' + time.timeTsToStr(line[1]) + '\n'
  }
  editHourProxy.value = res
  editHourOpen.value = true
}
function confirmEditHour() {
  let res = []
  for (const line of editHourProxy.value.split('\n')) {
    const pair = line.split(' ')
    if (pair.length !== 2) {
      continue
    }
    res.push([time.timeStrToTs(pair[0]), time.timeStrToTs(pair[1])])
  }
  LS.hour = JSON.stringify(res)
  editHourOpen.value = false
}

const editPeriodOpen = ref(false)
const editPeriodProxy = ref('')
function openEditPeriodDialog() {
  const obj = JSON.parse(LS.period)
  let res = ''
  for (const line of obj) {
    res += `${line[0]} ${line[1]}\n`
  }
  editPeriodProxy.value = res
  editPeriodOpen.value = true
}
function confirmEditPeriod() {
  let res = []
  for (const line of editPeriodProxy.value.split('\n')) {
    const pair = line.split(' ')
    if (pair.length !== 2) {
      continue
    }
    res.push([Number(pair[0]), Number(pair[1])])
  }
  LS.period = JSON.stringify(res)
  editPeriodOpen.value = false
}

function showAbout() {
  dialog.info('关于', `AlTodo - 一款为（一个）大学生设计的课表、事项管理软件<br>By CmdBlockZQG@HHU`)
}
</script>
