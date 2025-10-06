<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const id = route.params.id // "hard" or "light"
</script>

<template>
  <section class="max-w-4xl mx-auto p-6 space-y-4">
    <RouterLink to="/" class="underline">← Back</RouterLink>
    <h1 class="font-title text-3xl text-accent">
      Race: {{ id === 'hard' ? 'SwimRun HARD' : 'SwimRun LIGHT' }}
    </h1>

    <p class="font-body">Here we’ll show distance, map, date, etc.</p>

    <RouterLink :to="{ name: 'register', params: { raceId: id } }"
      class="inline-block bg-[color:var(--color-brand)] text-[color:var(--color-on-brand-text)]
             rounded-lg px-5 py-3 font-title">
      Register
    </RouterLink>
  </section>
</template>
