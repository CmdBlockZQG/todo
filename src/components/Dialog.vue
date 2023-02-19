<template>
  <div class="text-center">
    <v-dialog v-model="show" width="auto">
      <v-card style="min-width: 300px">
        <v-card-title>{{ props.title }}</v-card-title>
        <v-card-text >{{ props.text }}</v-card-text>
        <v-divider/>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue"
            variant="text"
            @click="show = false, $emit('cancel')"
          >取消</v-btn>
          <v-btn
            color="blue"
            variant="flat"
            @click="show = false, $emit('ok')"
          >确认</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
  import { ref, defineProps } from 'vue'
  const props = defineProps(['title', 'text'])
  const show = ref(true)
</script>
