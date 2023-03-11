<template>
  <v-app-bar density="compact">
    <template v-slot:prepend>
      <v-btn icon="mdi-arrow-left" @click="router.back()"></v-btn>
    </template>
    <v-app-bar-title>编辑课程安排</v-app-bar-title>
    <template v-slot:append>
      <v-btn icon="mdi-plus" @click="addCourse"></v-btn>
    </template>
  </v-app-bar>
  <v-main>
    <div class="overflow-hidden bg-grey-lighten-3 pb-16 h-100">
      <v-sheet class="mt-2 pa-3">
        <div class="text-h5">高等数学BⅡ</div>
        <div>这是关于高等数学BⅡ的一些备注</div>
        <div class="text-caption text-disabled">123123</div>
      </v-sheet>
    </div>
  </v-main>

  <v-dialog
    v-model="dialogOpen"
    width="400"
  >
    <v-card>
      <v-card-title><span class="text-h5">{{ curCourseId ? '修改' : '新建' }}课程</span></v-card-title>
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
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="showHelp">查看格式说明</v-btn>
        <v-btn color="primary" @click="dialogOpen = false">取消</v-btn>
        <v-btn color="primary" variant="flat" @click="dialogConfirm">确认</v-btn>
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
    c.arr = c.arr.map((id) => JSON.parse(LS[id]))
  }
})

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

const curCourseId = ref('')
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

  curCourseId.value = ''
  dialogOpen.value = true
}
function dialogConfirm() {
  const courseId = genId()
  const arrIdList = []
  for (const line of editProxy.value.arrange.split('\n')) {
    const a = line.split(' ')
    if (a.length < 4) continue
    const arrId = genId()
    arrIdList.push(arrId)
    LS[arrId] = JSON.stringify({
      courseId: courseId,
      week: range.parse(a[0]),
      day: Number(a[1]),
      hour: range.pair(a[2]),
      place: a[3],
      remark: a[4] || ''
    })
  }
  LS[courseId] = JSON.stringify({
    title: editProxy.value.title,
    remark: editProxy.value.remark,
    arr: arrIdList
  })
}

</script>
