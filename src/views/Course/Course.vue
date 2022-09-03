<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-btn flat round icon="arrow_back" @touchend="router.back()" />
      <q-toolbar-title>课程安排</q-toolbar-title>
      <q-btn flat round icon="more_vert" >
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item clickable v-close-popup @click="router.push('/course/new')">
              <q-item-section>新建课程</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>清空全部课程</q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-header>

  <q-page-container>
    <div class="q-pa-md">
      <template v-if="loading">
        <div class="text-center">
          <q-spinner-cube
            color="primary"
            size="4em"
          />
        </div>
      </template>
      <template v-else-if="courses.length === 0">
        <div style="text-align: center; color: grey;">
          <div style="font-size: 80px;"><q-icon name="inbox" /></div>
          <p>暂时没有课程<br>点击右上<q-icon name="more_vert" />按钮添加课程</p>
        </div>
      </template>
      <template v-else>
        <q-list>
          <q-expansion-item group="gp" v-for="course in courses" popup :label="course.name" :caption="course.id">
            <q-separator />
            <q-card>
              <q-card-section>
                <p>{{ course.remark }}</p>
                <q-markup-table dense class="q-mb-md">
                  <thead>
                    <tr>
                      <th>教学周</th>
                      <th>星期</th>
                      <th>小节课</th>
                      <th>地点</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="arr in course.arr">
                      <td class="text-center">{{ stringify(arr.week) }}</td>
                      <td class="text-center">{{ arr.day }}</td>
                      <td class="text-center">{{ arr.hour[0] }}-{{ arr.hour[1] }}</td>
                      <td class="text-center">{{ arr.place }}</td>
                    </tr>
                  </tbody>
                </q-markup-table>
                <div class="q-gutter-sm">
                  <q-btn color="primary" icon="edit" label="编辑课程" />
                  <q-btn color="negative" icon="delete" label="删除课程" />
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-list>
      </template>

    </div>
  </q-page-container>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { getCourses } from "../../service/course.js"

  const router = useRouter()

  const loading = ref(true)
  const courses = ref([])

  onMounted(async () => {
    courses.value = await getCourses()
    loading.value = false
  })

  function stringify(lis) {
    if (lis.length === 0) return ''
    lis = lis.sort((x, y) => x - y)
    let res = []
    let l = 0
    for (let i = 1; i < lis.length; ++i) {
      if (lis[i] === lis[i - 1] + 1) continue
      if (i === l + 1) res.push(lis[l])
      else res.push(`${lis[l]}-${lis[i - 1]}`)
      l = i
    }
    if (l + 1 === lis.length) res.push(lis[l])
    else res.push(`${lis[l]}-${lis[lis.length - 1]}`)
    return res.join(',')
  }

</script>

<style scoped>

</style>
