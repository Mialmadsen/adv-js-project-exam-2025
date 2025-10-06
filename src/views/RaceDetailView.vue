<script setup>
import { useRoute } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
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
      >
      <BaseButton variant="solid">Register</BaseButton>
    </RouterLink>
  </section>
</template>
