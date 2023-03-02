<template>
  <h1>test</h1>
  <v-btn @click="onclicka">confirm</v-btn>
  <v-btn @click="onclickb">info</v-btn>
</template>

<script setup>
import dialog from '../utils/dialog.js'

function onclicka() {
  dialog.confirm('123', '123', () => { console.log('ok') }, () => { console.log('cancel') })
}

function onclickb() {
  dialog.info('信息', '这是一些信息', () => { console.log('ok') })
}

</script>