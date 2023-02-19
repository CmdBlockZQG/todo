<template>
  test
  <v-btn @click="onclick">elevated (default)</v-btn>
</template>

<script setup>
import dialog from '../utils/dialog.js'

function onclick() {
  dialog('123', '123', () => { dialog('321', '321') }, () => { console.log('cancel') })
}

</script>