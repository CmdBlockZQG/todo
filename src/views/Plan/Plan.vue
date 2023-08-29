<template>
  <div class="overflow-hidden bg-grey-lighten-3 h-100" style="padding-bottom: 96px">
    <v-sheet
      v-for="(plan, i) in plans"
      @click="openOptDialog(plan.id, i)"
      v-ripple
      class="mt-2 pa-3"
      :class="[planColor[i]]"
    >
      <div class="text-h5">{{ plan.title }}</div>
      <div>{{ plan.content }}</div>
      <div class="text-caption d-flex align-center">
        <v-icon icon="mdi-clock-outline"></v-icon>
        <div class="ml-1 text-body-2">
          {{ time.desc(plan.date, false) }}
          {{ time.timeTsToStr(plan.start) }}
          ~
          {{ time.timeTsToStr(plan.end) }}
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
      @click="openAddDialog"
    ></v-btn>
  </div>

  <v-dialog
    v-model="addDialogOpen"
    width="400"
  >
    <v-card>
      <v-card-title><span class="text-h5">添加事项</span></v-card-title>
      <v-card-text>
        <v-text-field label="标题" v-model="addDialog.title"></v-text-field>
        <v-textarea label="内容" v-model="addDialog.content"></v-textarea>
        <div class="mb-1">日期： <DatePicker v-model="addDialog.date"></DatePicker></div>
        <div class="mb-1">开始时间： <TimePicker v-model="addDialog.start"></TimePicker></div>
        <div class="mb-1">结束时间： <TimePicker v-model="addDialog.end"></TimePicker></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="addDialogOpen = false">取消</v-btn>
        <v-btn color="primary" variant="flat" @click="confirmAddDialog">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="optDialogOpen"
    width="400"
  >
    <v-card>
      <v-card-title><span class="text-h5">{{ curPlan.title }}</span></v-card-title>
      <v-card-text>
        {{ curPlan.content }}
        <div class="text-caption text-disabled mt-1">
          {{ time.dateTsToStr(curPlan.date) }}
          {{ time.timeTsToStr(curPlan.start) }}
          ~
          {{ time.timeTsToStr(curPlan.end) }}
        </div>
      </v-card-text>
      <div class="pa-2">
        <v-btn block variant="text" @click="openEditDialog">编辑</v-btn>
        <v-btn block variant="text" class="mt-1" @click="delPlan">删除</v-btn>
        <v-btn block variant="text" class="mt-1" @click="optDialogOpen = false">取消</v-btn>
      </div>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="editDialogOpen"
    width="400"
  >
    <v-card>
      <v-card-title><span class="text-h5">编辑事项</span></v-card-title>
      <v-card-text>
        <v-text-field label="标题" v-model="editDialog.title"></v-text-field>
        <v-textarea label="内容" v-model="editDialog.content"></v-textarea>
        <div class="mb-1">日期： <DatePicker v-model="editDialog.date"></DatePicker></div>
        <div class="mb-1">开始时间： <TimePicker v-model="editDialog.start"></TimePicker></div>
        <div class="mb-1">结束时间： <TimePicker v-model="editDialog.end"></TimePicker></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="editDialogOpen = false">取消</v-btn>
        <v-btn color="primary" variant="flat" @click="confirmEditDialog">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import dialog from '../../utils/dialog.js'
import genId from '../../utils/genId.js'
import time from '../../utils/time'
import DatePicker from '../../components/DatePicker.vue'
import TimePicker from '../../components/TimePicker.vue'

const LS = window.localStorage
const today = time.today()
const curTime = time.curTime()


const planIdList = ref([])
if (LS.plan) {
  planIdList.value = JSON.parse(LS.plan)
} else {
  LS.plan = '[]'
}

const plans = ref([])

function updatePlans() {
  plans.value = planIdList.value.map((id) => {
    const res = JSON.parse(LS[id])
    res.id = id
    return res
  }).sort((a, b) => {
    if (a.date === b.date) {
      return a.end === b.end ? a.start - b.start : a.end - b.end
    } else {
      return a.date - b.date
    }
  })
}
onMounted(updatePlans)
watchEffect(updatePlans)

const planColor = computed(() => {
  return plans.value.map(x => {
    if (x.date > today) return 'future'
    if (x.date < today) return 'past'
    if (curTime < x.start) return 'future'
    if (x.end < curTime) return 'past'
    return 'ing'
  })
})


const addDialogOpen = ref(false)
const addDialog = ref({
  title: '',
  content: '',
  date: 0,
  start: 0,
  end: 86340
})
function openAddDialog() {
  addDialog.value = {
    title: '',
    content: '',
    date: time.today(),
    start: 0,
    end: 86340
  }
  addDialogOpen.value = true
}
function confirmAddDialog() {
  const id = genId()
  LS[id] = JSON.stringify(addDialog.value)
  planIdList.value.push(id)
  LS.plan = JSON.stringify(planIdList.value)
  addDialogOpen.value = false
}

const curPlanId = ref('')
const curPlanIndex = ref(0)
const curPlan = computed(() => plans.value[curPlanIndex.value])

const optDialogOpen = ref(false)
function openOptDialog(id, index) {
  curPlanId.value = id
  curPlanIndex.value = index
  optDialogOpen.value = true
}
function delPlan() {
  optDialogOpen.value = false
  dialog.confirm('删除事项', `确认删除<b>${curPlan.value.title}</b>吗？`, () => {
    planIdList.value.splice(planIdList.value.indexOf(curPlanId.value), 1)
    delete LS[curPlanId.value]
    LS.plan = JSON.stringify(planIdList.value)
  })
}

const editDialogOpen = ref(false)
const editDialog = ref({
  title: '',
  content: '',
  date: 0,
  start: 0,
  end: 0
})
function openEditDialog() {
  optDialogOpen.value = false
  editDialog.value = {
    title: curPlan.value.title,
    content: curPlan.value.content,
    date: curPlan.value.date,
    start: curPlan.value.start,
    end: curPlan.value.end
  }
  editDialogOpen.value = true
}
function confirmEditDialog() {
  LS[curPlanId.value] = JSON.stringify(editDialog.value)
  updatePlans()
  editDialogOpen.value = false
}

</script>

<style scoped>
.float-btn {
  position: fixed;
  right: 16px;
  bottom: 72px;
}

.past {
  border-left: #FB8C00 4px solid;
}

.ing {
  border-left: #0091EA 4px solid;
}

.future {
  border-left: #4CAF50 4px solid;
}
</style>
