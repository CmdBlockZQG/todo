<template>
  <div class="text-center">
    <v-dialog width="auto" persistent v-model="show">
      <v-card style="min-width: 300px">
        <v-card-title class="text-h5">
          <div class="d-flex align-center">
            <v-icon size="small" color="info" v-if="props.type === 'confirm'">mdi-help-circle-outline</v-icon>
            <v-icon size="small" color="info" v-if="props.type === 'info'">mdi-information-outline</v-icon>
            <v-icon size="small" color="warning" v-if="props.type === 'warning'">mdi-alert-circle-outline</v-icon>
            <v-icon size="small" color="error" v-if="props.type === 'error'">mdi-close-circle-outline</v-icon>
            <v-icon size="small" color="success" v-if="props.type === 'success'">mdi-check-circle-outline</v-icon>
            <div class="ml-2">{{ props.title }}</div>
          </div>
        </v-card-title>
        <v-card-text v-html="props.text"></v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn
            color="primary"
            variant="text"
            v-if="props.type === 'confirm'"
            @click="show = false, $emit('cancel')"
          >取消</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            @click="show = false, $emit('ok')"
          >确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  const props = defineProps(['title', 'text', 'type'])
  const show = ref(true)
</script>
