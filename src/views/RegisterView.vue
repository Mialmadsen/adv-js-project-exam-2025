<script setup>
import { useRoute } from 'vue-router'
const raceId = useRoute().params.raceId
</script>

<template>
  <section class="max-w-3xl mx-auto p-6 space-y-4">
    <h1 class="font-title text-2xl">Register — {{ raceId }}</h1>
    <p class="font-body">Login / Create account → choose options (t-shirt, medal) → confirm profile.</p>
  </section>
</template>
