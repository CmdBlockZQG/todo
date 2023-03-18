<template>
  <div class="overflow-hidden bg-grey-lighten-3 h-100" style="padding-bottom: 96px">
    <v-sheet v-ripple class="mt-2 pa-3 testa">
      <div class="text-h5">123456</div>
      <div>7654321</div>
      <div class="text-caption text-disabled">345678</div>
    </v-sheet>
  </div>
  <div class="float-btn">
    <v-btn
      icon="mdi-plus"
      size="x-large"
      color="primary"
      class="elevation-8"
      @click=""
    ></v-btn>
  </div>
</template>

<script setup>

</script>

<style scoped>
.float-btn {
  position: fixed;
  right: 16px;
  bottom: 72px;
}

.testa {
  border-left: #4CAF50 4px solid;
}
</style>
