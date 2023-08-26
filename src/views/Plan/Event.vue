<template>
  <div class="overflow-hidden bg-grey-lighten-3 h-100" style="padding-bottom: 96px">
    <v-sheet 
      v-for="(event, i) in events" 
      @click="openOptDialog(event.id, i)"
      v-ripple 
      class="mt-2 pa-3 green" 
      :class="[eventColor[i]]"
    >
      <div class="text-h5">{{ event.title }}</div>
      <div>{{ event.content }}</div>
      <div class="text-caption d-flex align-center">
        <v-icon icon="mdi-clock-outline"></v-icon>
        <div class="ml-1 text-body-2">
          {{ time.desc(event.date + event.time) }}
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
      <v-card-title><span class="text-h5">添加事件</span></v-card-title>
      <v-card-text>
        <v-text-field label="标题" v-model="addDialog.title"></v-text-field>
        <v-textarea label="内容" v-model="addDialog.content"></v-textarea>
        <div class="mb-1">日期： <DatePicker v-model="addDialog.date"></DatePicker></div>
        <div class="mb-1">时间： <TimePicker v-model="addDialog.time"></TimePicker></div>
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
      <v-card-title><span class="text-h5">{{ curEvent.title }}</span></v-card-title>
      <v-card-text>
        {{ curEvent.content }}
        <div class="text-caption text-disabled mt-1">
          {{ time.dateTsToStr(curEvent.date) }}
          {{ time.timeTsToStr(curEvent.time) }}
        </div>
      </v-card-text>
      <div class="pa-2">
        <v-btn block variant="text" @click="openEditDialog">编辑</v-btn>
        <v-btn block variant="text" class="mt-1" @click="delEvent">删除</v-btn>
        <v-btn block variant="text" class="mt-1" @click="optDialogOpen = false">取消</v-btn>
      </div>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="editDialogOpen"
    width="400"
  >
    <v-card>
      <v-card-title><span class="text-h5">编辑事件</span></v-card-title>
      <v-card-text>
        <v-text-field label="标题" v-model="editDialog.title"></v-text-field>
        <v-textarea label="内容" v-model="editDialog.content"></v-textarea>
        <div class="mb-1">日期： <DatePicker v-model="editDialog.date"></DatePicker></div>
        <div class="mb-1">时间： <TimePicker v-model="editDialog.time"></TimePicker></div>
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


const eventIdList = ref([])
if (LS.event) {
  eventIdList.value = JSON.parse(LS.event)
} else {
  LS.event = '[]'
}

const events = ref([])

function updateEvents() {
  events.value = eventIdList.value.map((id) => {
    const res = JSON.parse(LS[id])
    res.id = id
    return res
  }).sort((a, b) => {
    if (a.date === b.date) {
      return a.time - b.time
    } else {
      return a.date - b.date
    }
  })
}
onMounted(updateEvents)
watchEffect(updateEvents)

const eventColor = computed(() => {
  return events.value.map(x => {
    if (x.date > today) return 'future'
    if (x.date < today) return 'past'
    if (curTime < x.time) return 'future'
    if (x.time < curTime) return 'past'
    return 'ing'
  })
})


const addDialogOpen = ref(false)
const addDialog = ref({
  title: '',
  content: '',
  date: 0,
  time: 43200
})
function openAddDialog() {
  addDialog.value = {
    title: '',
    content: '',
    date: time.today(),
    time: 43200
  }
  addDialogOpen.value = true
}
function confirmAddDialog() {
  const id = genId()
  LS[id] = JSON.stringify(addDialog.value)
  eventIdList.value.push(id)
  LS.event = JSON.stringify(eventIdList.value)
  addDialogOpen.value = false
}

const curEventId = ref('')
const curEventIndex = ref(0)
const curEvent = computed(() => events.value[curEventIndex.value])

const optDialogOpen = ref(false)
function openOptDialog(id, index) {
  curEventId.value = id
  curEventIndex.value = index
  optDialogOpen.value = true
}
function delEvent() {
  optDialogOpen.value = false
  dialog.confirm('删除事件', `确认删除<b>${curEvent.value.title}</b>吗？`, () => {
    eventIdList.value.splice(eventIdList.value.indexOf(curEventId.value), 1)
    delete LS[curEventId.value]
    LS.event = JSON.stringify(eventIdList.value)
  })
}

const editDialogOpen = ref(false)
const editDialog = ref({
  title: '',
  content: '',
  date: 0,
  time: 43200
})
function openEditDialog() {
  optDialogOpen.value = false
  editDialog.value = {
    title: curEvent.value.title,
    content: curEvent.value.content,
    date: curEvent.value.date,
    time: curEvent.value.time
  }
  editDialogOpen.value = true
}
function confirmEditDialog() {
  LS[curEventId.value] = JSON.stringify(editDialog.value)
  updateEvents()
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
  border-left: #B00020 4px solid;
}

.ing {
  border-left: #0091EA 4px solid;
}

.future {
  border-left: #4CAF50 4px solid;
}
</style>
