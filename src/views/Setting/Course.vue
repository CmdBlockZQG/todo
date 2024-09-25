<template>
  <v-app-bar density="compact">
    <template v-slot:prepend>
      <v-btn icon="mdi-arrow-left" @click="router.back()"></v-btn>
    </template>
    <v-app-bar-title>编辑课程安排</v-app-bar-title>
    <template v-slot:append>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>
        <v-list>
          <v-list-item link @click="clearCourse">
            <v-list-item-title style="line-height: 20px;">
              <v-icon icon="mdi-close" size="small"></v-icon>
              <span> 清空课程数据</span>
            </v-list-item-title>
          </v-list-item>
          <v-list-item link @click="exportCourse">
            <v-list-item-title style="line-height: 20px;">
              <v-icon icon="mdi-export" size="small"></v-icon>
              <span> 导出课程数据</span>
            </v-list-item-title>
          </v-list-item>
          <v-list-item link @click="importCourse">
            <v-list-item-title style="line-height: 20px;">
              <v-icon icon="mdi-import" size="small"></v-icon>
              <span> 导入课程数据</span>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

    </template>
  </v-app-bar>
  <v-main>
    <div class="overflow-hidden bg-grey-lighten-3 h-100" style="padding-bottom: 96px">
      <v-sheet v-for="(course, index) in courses" class="mt-2">
        <div class="pa-3">
          <div class="text-h5">{{ course.title }}</div>
          <div>{{ course.remark }}</div>
        </div>
        <v-divider></v-divider>
        <div class="pa-1">
          <table>
            <thead>
              <tr>
                <th>教学周</th>
                <th>星期</th>
                <th>小节课</th>
                <th>地点</th>
                <th>备注</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="arr in course.arr">
                <td>{{ range.stringify(arr.week) }}</td>
                <td>{{ arr.day }}</td>
                <td>{{ arr.hour.join('-') }}</td>
                <td>{{ arr.place }}</td>
                <td>{{ arr.remark }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <v-divider></v-divider>
        <div class="py-1 px-3 text-right">
          <v-btn color="error" variant="text" @click="delCourse(index)">删除</v-btn>
          <v-btn color="primary" variant="text" @click="editCourse(index)">编辑</v-btn>
        </div>
      </v-sheet>
    </div>
  </v-main>

  <div class="float-btn">
    <v-btn
      icon="mdi-plus"
      size="x-large"
      color="primary"
      class="elevation-8"
      @click="addCourse"
    ></v-btn>
  </div>

  <v-dialog
    v-model="dialogOpen"
    width="400"
    persistent
  >
    <v-card>
      <v-card-title><span class="text-h5">{{ curCourseIndex === -1 ? '新建' : '修改' }}课程</span></v-card-title>
      <v-card-text>
        <v-text-field label="课程名" v-model="editProxy.title"></v-text-field>
        <v-text-field label="备注" v-model="editProxy.remark"></v-text-field>
        <v-textarea
          label="课程安排"
          v-model="editProxy.arrange"
          persistent-hint
        ></v-textarea>
      </v-card-text>
      <v-card-actions>
        <div class="spacer"></div>
        <v-btn color="primary" @click="showHelp">查看格式说明</v-btn>
        <v-btn color="primary" @click="dialogOpen = false">取消</v-btn>
        <v-btn color="primary" variant="flat" @click="dialogConfirm">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="dataDialogOpen"
    width="400"
    persistent
  >
    <v-card>
      <v-card-title><span class="text-h5">{{ dataDialogMode ? '导出' : '导入' }}</span></v-card-title>
      <v-card-text>
        <p v-if="!dataDialogMode">请注意 全部原有课程信息将被覆盖</p>
        <v-textarea v-model="dataProxy" :readonly="dataDialogMode"></v-textarea>
      </v-card-text>
      <v-card-actions>
        <div class="spacer"></div>
        <v-btn v-if="!dataDialogMode" color="primary" @click="dataDialogOpen = false">取消</v-btn>
        <v-btn color="primary" variant="flat" @click="dataDialogConfirm">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import dialog from '../../utils/dialog.js'
import range from '../../utils/range.js'
import genId from '../../utils/genId.js'

const router = useRouter()
const LS = window.localStorage

const courseIdList = ref(JSON.parse(LS.course))
const courses = computed(() => {
  const res = courseIdList.value.map((id) => JSON.parse(LS[id]))
  for (const c of res) {
    c.arrId = c.arr
    c.arr = c.arr.map((id) => JSON.parse(LS[id]))
  }
  return res
})
const arrangeIdList = computed(() => courses.value.reduce((t, c) => t.concat(c.arrId), []))

function showHelp() {
  dialog.info('课程安排格式说明', `每行一个课程安排，依次由教学周、星期、小节课、地点、备注（可空）组成，中间空格隔开。<br><br>
教学周格式说明：<br>
半角逗号隔开多个表述，每个表述可以是单纯的一个数字，表示本身，也可以是用横杠（减号）隔开的两个数，表示这两个数及其中间的所有数<br>
例如教学周 1,3-8,10 表示第一周，三到八周和第十周<br><br>
星期格式说明：<br>
1-7的数字，表示周一到周日<br><br>
小节课格式说明：<br>
横杠（减号）隔开的两个数，表示这个闭区间<br>
例如小节课 2-4 第二到第四小节课，共三个学时<br><br>
综合示例：1-16 1 1-2 高B101 早八记得早起<br>
没做容错，请自行核对格式`)
}

const curCourseIndex = ref(-1)
const dialogOpen = ref(false)
const editProxy = ref({
  title: '',
  remark: '',
  arrange: ''
})
function addCourse() {
  editProxy.value.title = ''
  editProxy.value.remark = ''
  editProxy.value.arrange = ''

  curCourseIndex.value = -1
  dialogOpen.value = true
}
function editCourse(index) {
  editProxy.value.title = courses.value[index].title
  editProxy.value.remark = courses.value[index].remark
  let arrange = ''
  for (let arr of courses.value[index].arr) {
    arrange += `${range.stringify(arr.week)} ${arr.day} ${arr.hour.join('-')} ${arr.place} ${arr.remark}\n`
  }
  editProxy.value.arrange = arrange
  curCourseIndex.value = index
  dialogOpen.value = true
}
function delCourse(index) {
  dialog.confirm('确认删除？', `确定要删除课程<b>${courses.value[index].title}</b>吗？`, () => {
    opDelCourse(index)
  })
}
function opDelCourse(index) {
  for (const arrId of courses.value[index].arrId) {
    delete LS[arrId]
  }
  delete LS[courseIdList.value[index]]
  courseIdList.value.splice(index, 1)
  LS.course = JSON.stringify(courseIdList.value)
  LS.arr = JSON.stringify(arrangeIdList.value)
}
function dialogConfirm() {
  if (curCourseIndex.value !== -1) {
    opDelCourse(curCourseIndex.value)
  }
  const courseId = genId()
  const arrIdList = []
  for (const line of editProxy.value.arrange.split('\n')) {
    const a = []
    let i = 0
    while (i < line.length && a.length < 4) {
      let j = line.indexOf(' ', i)
      if (j === -1) {
        a.push(line.slice(i))
        i = line.length
        break
      }
      a.push(line.slice(i, j))
      i = j + 1
    }
    if (a.length < 4) continue
    const arrId = genId()
    arrIdList.push(arrId)
    LS[arrId] = JSON.stringify({
      courseId: courseId,
      week: range.parse(a[0]),
      day: Number(a[1]),
      hour: range.pair(a[2]),
      place: a[3],
      remark: line.slice(i)
    })
  }
  LS[courseId] = JSON.stringify({
    title: editProxy.value.title,
    remark: editProxy.value.remark,
    arr: arrIdList
  })
  courseIdList.value.push(courseId)
  LS.course = JSON.stringify(courseIdList.value)
  LS.arr = JSON.stringify(arrangeIdList.value)
  dialogOpen.value = false
}
function clearCourse() {
  dialog.confirm('确认清除全部课程？', '删除后将无法恢复', () => {
    while (courseIdList.value.length) {
      opDelCourse(0)
    }
  })
}
const dataDialogOpen = ref(false)
const dataDialogMode = ref(false) // false:导入 true:导出
const dataProxy = ref('')
function exportCourse() {
  const res = {}
  res.course = LS.course
  res.arr = LS.arr
  for (let i = 0; i < courseIdList.value.length; ++i) {
    res[courseIdList.value[i]] = LS[courseIdList.value[i]]
    for (const j of courses.value[i].arrId) {
      res[j] = LS[j]
    }
  }
  dataDialogMode.value = true
  dataProxy.value = JSON.stringify(res)
  dataDialogOpen.value = true
}
function importCourse() {
  dataDialogMode.value = false
  dataProxy.value = ''
  dataDialogOpen.value = true
}
function dataDialogConfirm() {
  if (dataDialogMode.value) {
    dataDialogOpen.value = false
    return
  }
  while (courseIdList.value.length) {
    opDelCourse(0)
  }
  const obj = JSON.parse(dataProxy.value)
  for (const key in obj) {
    LS[key] = obj[key]
  }
  courseIdList.value = JSON.parse(LS.course)
  dataDialogOpen.value = false
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 2px 8px;
}
th {
  text-align: left;
  font-weight: 500;
  border-bottom: thin solid #e0e0e0;
  border-spacing: 0;
}
.float-btn {
  position: fixed;
  right: 16px;
  bottom: 16px;
}
</style>
