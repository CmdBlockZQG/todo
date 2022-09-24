<template>
{{ _id }}
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

let _id = route.params._id
</script>

<style scoped>

</style>

