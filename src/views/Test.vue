<template>
  <h1>test</h1>
  <v-btn @click="onclicka">confirm</v-btn>
  <v-btn @click="onclickb">info</v-btn>

  <div id="container">
    <div>1</div>
    <div>2</div>
    <div>3</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import SmoothDnD from 'smooth-dnd'
import dialog from '../utils/dialog.js'

onMounted(() => {
  const containerElem = document.getElementById('container')
  const container = SmoothDnD(containerElem, {
    lockAxis: "y",
    onDrop: (dropResult) => {
      console.log(dropResult)
    }
  })
})

function onclicka() {
  dialog.confirm('123', '123', () => { console.log('ok') }, () => { console.log('cancel') })
}

function onclickb() {
  dialog.info('信息', '这是一些信息', () => { console.log('ok') })
}

</script>
