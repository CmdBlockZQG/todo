<template>
  <v-app-bar density="compact">
    <v-app-bar-title>作业</v-app-bar-title>
    <template v-slot:append>
      <v-btn icon="mdi-cog-outline" @click="router.push('/setting')"></v-btn>
    </template>
  </v-app-bar>
  <v-main>
    <div v-if="dragRefresher" id="drag-container" class="overflow-hidden bg-grey-lighten-3 h-100" style="padding-bottom: 96px">
      <v-sheet v-for="(work, index) in works" v-ripple class="mt-2 pa-3" @click="openOptDialog(index)">
        <div class="text-h5">{{ work.title }}</div>
        <div>{{ work.content }}</div>
        <div class="text-caption text-disabled">{{ time.desc(work.time) }}</div>
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
  </v-main>

  <!-- 添加作业Dialog -->
  <v-dialog
    v-model="addDialogOpen"
    width="400"
    persistent
  >
    <v-card>
      <v-card-title><span class="text-h5">添加作业</span></v-card-title>
      <v-card-text>
        <v-text-field label="标题" v-model="addDialog.title"></v-text-field>
        <v-textarea label="内容" v-model="addDialog.content"></v-textarea>
      </v-card-text>
      <v-card-actions>
        <div class="spacer"></div>
        <v-btn color="primary" @click="addDialogOpen = false">取消</v-btn>
        <v-btn color="primary" variant="flat" @click="confirmAddDialog">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- 选项Dialog -->
  <v-dialog
    v-model="optDialogOpen"
    width="400"
    persistent
  >
    <v-card>
      <v-card-title><span class="text-h5">{{ curWork.title }}</span></v-card-title>
      <v-card-text>
        {{ curWork.content }}
        <div class="text-caption text-disabled mt-1">{{ new Date(curWork.time * 1000).toLocaleString().replace(/\//g, '-') }}</div>
      </v-card-text>
      <div class="pa-2">
        <v-btn block variant="text" @click="openEditDialog">编辑</v-btn>
        <v-btn block variant="text" class="mt-1" @click="delWork">删除</v-btn>
        <v-btn block variant="text" class="mt-1" @click="optDialogOpen = false">取消</v-btn>
      </div>
    </v-card>
  </v-dialog>

  <!-- 编辑作业Dialog -->
  <v-dialog
    v-model="editDialogOpen"
    width="400"
    persistent
  >
    <v-card>
      <v-card-title><span class="text-h5">编辑作业</span></v-card-title>
      <v-card-text>
        <v-text-field label="标题" v-model="editDialog.title"></v-text-field>
        <v-textarea label="内容" v-model="editDialog.content"></v-textarea>
      </v-card-text>
      <v-card-actions>
        <div class="spacer"></div>
        <v-btn color="primary" @click="editDialogOpen = false">取消</v-btn>
        <v-btn color="primary" variant="flat" @click="confirmEditDialog">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { smoothDnD } from 'smooth-dnd'
import time from '../../utils/time.js'
import dialog from '../../utils/dialog.js'

const router = useRouter()
const LS = window.localStorage

const works = ref([])

if (LS.work) {
  works.value = JSON.parse(LS.work)
} else {
  LS.work = '[]'
}

const dragRefresher = ref(true)
let dragContainer = null

function refreshDrag() {
  dragContainer.dispose()
  dragRefresher.value = false
  nextTick(() => {
    dragRefresher.value = true
    nextTick(() => {
      bindDrag()
    })
  })
}

function bindDrag() {
  const dragContainerElem = document.getElementById('drag-container')
  dragContainer = smoothDnD(dragContainerElem, {
    lockAxis: "y",
    onDrop: (dropResult) => {
      const x = dropResult.removedIndex,
        y = dropResult.addedIndex
      if (x === y) return
      const cur = works.value.splice(x, 1)[0]
      works.value.splice(y, 0, cur)
      LS.work = JSON.stringify(works.value)
      refreshDrag()
    }
  })
}

onMounted(() => {
  bindDrag()
})

const addDialogOpen = ref(false)
const addDialog = ref({ title: '', content: '' })
function openAddDialog() {
  addDialog.value.title = ''
  addDialog.value.content = ''
  addDialogOpen.value = true
}
function confirmAddDialog() {
  works.value.push({
    title: addDialog.value.title,
    content: addDialog.value.content,
    time: time.ts()
  })
  LS.work = JSON.stringify(works.value)
  addDialogOpen.value = false
  refreshDrag()
}

const curWorkIndex = ref(0)
const curWork = computed(() => works.value[curWorkIndex.value] ? works.value[curWorkIndex.value] : { title: '', content: '', time: 0 })

const optDialogOpen = ref(false)
function openOptDialog(index) {
  curWorkIndex.value = index
  optDialogOpen.value = true
}
function delWork() {
  optDialogOpen.value = false
  dialog.confirm('删除作业', `确认删除<b>${curWork.value.title}</b>吗？`, () => {
    works.value.splice(curWorkIndex.value, 1)
    LS.work = JSON.stringify(works.value)
    refreshDrag()
  })
}

const editDialogOpen = ref(false)
const editDialog = ref({ title: '', content: '' })
function openEditDialog() {
  optDialogOpen.value = false
  editDialog.value.title = curWork.value.title
  editDialog.value.content = curWork.value.content
  editDialogOpen.value = true
}
function confirmEditDialog() {
  curWork.value.title = editDialog.value.title
  curWork.value.content = editDialog.value.content
  curWork.value.time = time.ts()
  LS.work = JSON.stringify(works.value)
  editDialogOpen.value = false
}

</script>

<style scoped>
.float-btn {
  position: fixed;
  right: 16px;
  bottom: 72px;
}
</style>
