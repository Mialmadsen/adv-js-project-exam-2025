<script setup>
import AppShell from '@/components/layout/AppShell.vue'

import AppHeader from '@/components/layout/AppHeader.vue'

import BaseSnackbar from './components/BaseSnackbar.vue'
</script>

<template>
  <AppShell>
    <template #header>
      <AppHeader />
    </template>

    <RouterView />
  </AppShell>
  <BaseSnackbar />
</template>
