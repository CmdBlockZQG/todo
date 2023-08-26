<template>
  <v-btn variant="tonal" @click="openDialog">
    {{ desc }} {{ date }} {{ weekday }}
  </v-btn>

  <v-dialog
    v-model="dialogShow"
    width="400"
  >
    <v-card>
      <v-tabs v-model="tab">
        <v-tab :value="0">相对日</v-tab>
        <v-tab :value="1">年月日</v-tab>
        <v-tab :value="2">教学周</v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item :value="0">
            <div class="d-flex align-end justify-center">
              <span>今日</span>
              <v-btn
                variant="tonal"
                density="compact"
                :icon="relDay.dir ? 'mdi-plus' : 'mdi-minus'"
                @click="relDay.dir = !relDay.dir"
                style="margin-left: 16px;"
              ></v-btn>
              <div style="width: 120px; margin: 0 16px;">
                <v-text-field
                  variant="underlined"
                  density="compact"
                  hide-details="auto"
                  type="number"
                  v-model.number="relDay.day"
                ></v-text-field>
              </div>
              <span>天</span>
            </div>
          </v-window-item>
          <v-window-item :value="1">
            <div class="d-flex align-end justify-center">
              <div style="width: 80px; margin: 0 16px;">
                <v-text-field
                  variant="underlined"
                  density="compact"
                  hide-details="auto"
                  type="number"
                  v-model.number="ymd.year"
                ></v-text-field>
              </div>
              <span>年</span>
              <div style="width: 40px; margin: 0 16px;">
                <v-text-field
                  variant="underlined"
                  density="compact"
                  hide-details="auto"
                  type="number"
                  v-model.number="ymd.month"
                ></v-text-field>
              </div>
              <span>月</span>
              <div style="width: 40px; margin: 0 16px;">
                <v-text-field
                  variant="underlined"
                  density="compact"
                  hide-details="auto"
                  type="number"
                  v-model.number="ymd.day"
                ></v-text-field>
              </div>
              <span>日</span>
            </div>
          </v-window-item>
          <v-window-item :value="2">
            <div class="d-flex align-end justify-center">
              <span>第</span>
              <div style="width: 50px; margin: 0 16px;">
                <v-text-field
                  variant="underlined"
                  density="compact"
                  hide-details="auto"
                  type="number"
                  v-model.number="wd.week"
                ></v-text-field>
              </div>
              <span>周星期</span>
              <div style="width: 50px; margin: 0 16px;">
                <v-text-field
                  variant="underlined"
                  density="compact"
                  hide-details="auto"
                  type="number"
                  v-model.number="wd.day"
                ></v-text-field>
              </div>
            </div>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="dialogShow = false">取消</v-btn>
        <v-btn color="primary" variant="text" @click="dialogConfirm">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup>
import { computed, ref } from 'vue'
import time from '../utils/time.js'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const desc = computed(() => time.desc(props.modelValue, false))
const date = computed(() => time.dateTsToStr(props.modelValue))
const weekday = computed(() => time.dateTsToWeekdayStr(props.modelValue))

const dialogShow = ref(false)
const tab = ref(0)

const relDay = ref({
  dir: true,
  day: 0
})
const ymd = ref({
  year: 2020,
  month: 1,
  day: 1
})
const wd = ref({
  week: 1,
  day: 1
})

function openDialog() {
  const today = time.today()
  relDay.value.day = Math.abs(Math.floor((props.modelValue - today) / 86400))
  relDay.value.dir = props.modelValue >= today

  ymd.value = time.dateTsToObj(props.modelValue)
  wd.value = time.dateTsToWeekdayObj(props.modelValue)

  dialogShow.value = true
}
function dialogConfirm() {
  let res = time.today()
  if (tab.value === 0) {
    if (relDay.value.dir) res += 86400 * relDay.value.day
    else res -= 86400 * relDay.value.day
  } else if (tab.value === 1) {
    res = time.dateStrToTs(`${ymd.value.year}-${ymd.value.month}-${ymd.value.day}`)
  } else if (tab.value === 2) {
    res = Number(window.localStorage.orig) + (wd.value.week - 1) * 7 * 86400 + (wd.value.day - 1) * 86400
  }

  emit('update:modelValue', res)
  dialogShow.value = false
}

</script>

<style scoped>

</style>
