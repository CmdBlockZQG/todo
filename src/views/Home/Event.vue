<template>
  <q-header elevated class="bg-primary text-white" height-hint="98">
    <q-toolbar>
      <q-toolbar-title>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
        </q-avatar>
        <span id="home-title"></span>
        Title
      </q-toolbar-title>
    </q-toolbar>

    <q-tabs align="left">
      <q-route-tab label="Page One" />
      <q-route-tab label="Page Two" />
      <q-route-tab label="Page Three" />
    </q-tabs>
  </q-header>

  <q-page-container>
    <h1>Event</h1>
  </q-page-container>
</template>

<script setup>
</script>

<style scoped>

</style>
