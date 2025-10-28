<script setup>
import { onMounted } from 'vue'

import BaseCard   from '@/components/BaseCard.vue'
import { useRaces } from '@/composables/UseRaces'

const { races, loading, error, loadAll } = useRaces()
onMounted(loadAll)
</script>

<template>
  <section class="mt-8 overflow-x-clip px-4 sm:px-6">
    <h2 class="font-title text-3xl text-accent mb-4">Check out our races!</h2>

    <div v-if="loading" class="my-10 text-text/70">Loading races…</div>
    <div v-else-if="error" class="my-10 text-danger">{{ error }}</div>

    <div
      v-else
      id="races"
      class="my-14 mx-auto flex flex-row flex-wrap justify-center gap-8 gap-y-12"
    >
      <BaseCard
        v-for="r in races"
        :key="r.id"
        :title="r.title"
        :length="r.lengthKm"
        :location="r.locationCity"
        :date="r.date"
        :image="r.imageUrl || ''"
        :to="{ name: 'race', params: { id: r.id } }"
      />
    </div>
  </section>


</template>
