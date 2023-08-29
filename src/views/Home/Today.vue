<template>
  <v-app-bar density="compact">
    <v-app-bar-title>
      {{ time.dateTsToStr(today, '-', false) }}
      {{ time.dateTsToWeekdayStr(today) }}
    </v-app-bar-title>
    <template v-slot:append>
      <v-btn icon="mdi-calendar-month-outline"></v-btn>
    </template>
  </v-app-bar>
  <v-main>
    <div class="overflow-hidden bg-grey-lighten-3 h-100">
      <!--进行中/将来的事项-->
      <v-sheet
        v-ripple
        class="mt-2 pa-3 d-flex"
        v-for="plan in activePlans"
        :class="[curTime >= plan.start ? 'ing' : 'future']"
      >
        <div style="width: 70%">
          <div class="text-h5">{{ plan.title }}</div>
          <div>
            {{ plan.content }}
            <template v-if="plan.remark"><br>123123{{ plan.remark }}</template>
          </div>
        </div>
        <div class="text-center d-flex flex-column justify-center desc-box" style="width: 30%">
          <div class="text-caption d-flex align-center justify-center">
            <v-icon icon="mdi-clock-outline"></v-icon>
            <div class="ml-1 text-body-2">
              {{ time.timeTsToStr(plan.start) }}~{{ time.timeTsToStr(plan.end) }}
            </div>
          </div>
          <div class="text-caption">距离{{ curTime >= plan.start ? '结束' : '开始' }}还剩</div>
          <div class="text-h6 font-weight-black" :class="[curTime >= plan.start ? 'text-warning' : 'text-primary']">{{ timeLeftStr(plan.start, plan.end) }}</div>
        </div>
      </v-sheet>
      <!--隐藏/显示已过期事项按钮-->
      <v-btn block density="compact" variant="tonal" class="mt-2 text-caption text-disabled" ripple v-if="expiredPlans.length" @click="showExpiredPlans = !showExpiredPlans">
        {{ showExpiredPlans ? '隐藏' : '显示' }}已过期事项
        <v-icon :icon="showExpiredPlans ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
      </v-btn>
      <!--已过期事项-->
      <v-sheet
        v-ripple
        class="mt-2 pa-3 expired"
        v-for="plan in expiredPlans"
        v-show="showExpiredPlans"
      >
        <div class="text-h5">{{ plan.title }}</div>
        <div>
          {{ plan.content }}
          <template v-if="plan.remark"><br>123123{{ plan.remark }}</template>
        </div>
        <div class="text-caption d-flex align-center">
          <v-icon icon="mdi-clock-outline"></v-icon>
          <div class="ml-1 text-body-2">
            {{ time.timeTsToStr(plan.start) }}~{{ time.timeTsToStr(plan.end) }}
          </div>
        </div>
      </v-sheet>
      <!--当日课表-->
      <div class="mt-2">这里应该是课表 但是还没做好</div>
      <!--将来的事件-->
      <v-sheet
        v-ripple
        class="mt-2 pa-3 d-flex"
        v-for="event in activeEvents"
        :class="[curTime > event.time ? 'past' : 'future']"
      >
        <div style="width: 70%">
          <div class="text-h5">{{ event.title }}</div>
          <div>{{ event.content }}</div>
        </div>
        <div class="text-center d-flex flex-column justify-center desc-box" style="width: 30%">
          <template v-if="today < event.date">
            <div class="text-caption d-flex align-center justify-center">
              <v-icon icon="mdi-calendar-outline"></v-icon>
              <div class="ml-1 text-body-2">
                {{ time.dateTsToStr(event.date, '-', false) }}
              </div>
            </div>
            <div class="text-caption">还剩</div>
            <div class="text-h6 font-weight-black text-primary" >{{ Math.floor((event.date - today) / 86400) }}天</div>
          </template>
          <template v-else>
            <div class="text-caption d-flex align-center justify-center">
              <v-icon icon="mdi-timelapse"></v-icon>
              <div class="ml-1 text-body-2">
                {{ time.timeTsToStr(event.time) }}
              </div>
            </div>
            <div class="text-caption">还剩</div>
            <div class="text-h6 font-weight-black text-warning" >{{ timeLeftStr(0, event.time) }}</div>
          </template>
        </div>
      </v-sheet>
      <!--隐藏/显示已过期事件按钮-->
      <v-btn block density="compact" variant="tonal" class="mt-2 text-caption text-disabled" ripple v-if="expiredEvents.length" @click="showExpiredEvents = !showExpiredEvents">
        {{ showExpiredPlans ? '隐藏' : '显示' }}已过期事件
        <v-icon :icon="showExpiredEvents ? 'mdi-chevron-up' : 'mdi-chevron-down'"></v-icon>
      </v-btn>
      <!--已过期事件-->
      <v-sheet
        v-ripple
        class="mt-2 pa-3 expired"
        v-for="event in expiredEvents"
        v-show="showExpiredEvents"
      >
        <div class="text-h5">{{ event.title }}</div>
        <div>{{ event.content }}</div>
        <div class="text-caption d-flex align-center">
          <v-icon icon="mdi-clock-outline"></v-icon>
          <div class="ml-1 text-body-2">
            今天 {{ time.timeTsToStr(event.time) }}
          </div>
        </div>
      </v-sheet>
    </div>
  </v-main>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted } from 'vue'
import dialog from '../../utils/dialog.js'
import genId from '../../utils/genId.js'
import time from '../../utils/time'
import scheduler from '../../service/scheduler.js'

const today = time.today()
const curTime = time.curTime()

const cmp = (x, y) => x.end === y.end ? x.start - y.start : x.end - y.end
const plans = [...scheduler.plans(today), ...scheduler.routines(today)].sort(cmp)
const events = scheduler.events(today)
const courses = scheduler.events(today)

const activePlans = plans.filter(x => x.end >= curTime)
const expiredPlans = plans.filter(x => x.end < curTime)

const activeEvents = events.filter(x => x.date > today || x.time > curTime)
const expiredEvents = events.filter(x => x.date === today && x.time <= curTime)

const showExpiredPlans = ref(false)
const showExpiredEvents = ref(false)



function timeLeftStr(start, end) {
  const deltaToStr = (d) => {
    const h = Math.floor(d / 3600),
          m = Math.floor((d % 3600) / 60)
    return h ? `${h}h${m}min` : `${m}min`
  }
  if (curTime >= start) return deltaToStr(end - curTime)
  else return deltaToStr(start - curTime)
}

</script>

<style scoped>
.expired {
  border-left: #b0b0b0 4px solid;
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

.desc-box {
  border-left: #b0b0b0 2px dashed;
}
</style>
