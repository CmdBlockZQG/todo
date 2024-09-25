<template>
  <v-btn variant="tonal" @click="openDialog">
    {{ displayTime }}
  </v-btn>

  <v-dialog
    v-model="dialogShow"
    width="400"
    persistent
  >
    <v-card>
      <v-tabs v-model="tab">
        <v-tab :value="0">小时分钟</v-tab>
        <v-tab :value="1">上/下课</v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item :value="0">
            <div class="d-flex align-end justify-center">
              <div style="width: 50px; margin: 0 16px;">
                <v-text-field
                  variant="underlined"
                  density="compact"
                  hide-details="auto"
                  type="number"
                  v-model.number="hm.hour"
                ></v-text-field>
              </div>
              <span>:</span>
              <div style="width: 50px; margin: 0 16px;">
                <v-text-field
                  variant="underlined"
                  density="compact"
                  hide-details="auto"
                  type="number"
                  v-model.number="hm.minute"
                ></v-text-field>
              </div>
            </div>
          </v-window-item>
          <v-window-item :value="1">
                <v-select
                  v-model="phe.period"
                  hide-details="auto"
                  density="compact"
                  :items="periodList"
                  label="大节课"
                  @update:modelValue="phe.hour = periods[phe.period][0] - 1"
                ></v-select>
                <v-select
                  v-model="phe.hour"
                  hide-details="auto"
                  density="compact"
                  :items="hourList"
                  label="小节课"
                ></v-select>
                <v-select
                  v-model="phe.end"
                  hide-details="auto"
                  density="compact"
                  :items="endList"
                  label="上下课"
                ></v-select>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions>
        <div class="spacer"></div>
        <v-btn variant="text" @click="dialogShow = false">取消</v-btn>
        <v-btn color="primary" variant="text" @click="dialogConfirm">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script setup>
import { computed, ref } from 'vue'
import time from '../utils/time.js'

const LS = window.localStorage

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const displayTime = computed(() => time.timeTsToStr(props.modelValue, false))

const dialogShow = ref(false)
const tab = ref(0)

const hm = ref({
  hour: 0,
  minute: 0
})
const phe = ref({
  period: 0,
  hour: 0,
  end: 0
})
const periods = JSON.parse(LS.period)
const periodList = computed(() => {
  const res = []
  for (let i = 0; i < periods.length; ++i) {
    res.push({
      title: `第${i + 1}大节`,
      value: i
    })
  }
  return res
})
const hourList = computed(() => {
  const seg = periods[phe.value.period]
  const res = []
  for (let i = seg[0]; i <= seg[1]; ++i) {
    res.push({
      title: `第${i}小节`,
      value: i - 1
    })
  }
  return res
})
const endList = [{ title: '上课', value: 0 }, { title: '下课', value: 1 }]

function openDialog() {
  hm.value.hour = Math.floor((props.modelValue % 86400) / 3600)
  hm.value.minute = Math.floor((props.modelValue % 3600) / 60)

  phe.value = {
    period: 0,
    hour: 0,
    end: 0
  }

  dialogShow.value = true
}
function dialogConfirm() {
  let res = props.modelValue
  if (tab.value === 0) {
    res = 3600 * hm.value.hour + 60 * hm.value.minute
  } else if (tab.value === 1) {
    const hour = JSON.parse(LS.hour)
    res = hour[phe.value.hour][phe.value.end]
  }
  emit('update:modelValue', res)
  dialogShow.value = false
}

</script>

<style scoped>

</style>
