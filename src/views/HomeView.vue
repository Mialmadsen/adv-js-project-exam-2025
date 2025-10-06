<template>



  <section class="mt-8 ">
    <h2 class="font-title text-3xl text-accent mb-4">Check out our races!</h2>

    <div id="races" class="flex flex-row justify-around my-14 gap-8">
      <BaseCard
        title="SwimRun HARD"
        length="13 km"
        location="Aarhus"
        date="Jun 15, 2025"
        :to="{ name: 'race', params: { id: 'hard' } }"
      />

      <BaseCard
        title="SwimRun LIGHT"
        length="9.5 km"
        location="Aarhus"
        date="Jun 15, 2025"
        :to="{ name: 'race', params: { id: 'light' } }"
      />
    </div>
  </section>
  <BaseButton variant="solid">Solid button</BaseButton>
</template>
<script setup>
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
</script>
