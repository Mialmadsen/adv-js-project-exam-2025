<template>



  <section class="mt-8 overflow-x-clip px-4 sm:px-6 ">
    <h2 class="font-title text-3xl text-accent mb-4">Check out our races!</h2>

    <div id="races" class="flex flex-row my-14 justify-center flex-wrap gap-8 max-w-screen-2xl mx-auto gap-y-12">
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
  <!-- These are our buttons and there code -->
  <div class="flex flex-row gap-2">
    <BaseButton variant="solid">Solid</BaseButton>
  <BaseButton variant="outline">Outline</BaseButton>
  <BaseButton>Liquid</BaseButton>
</div>

</template>
<script setup>
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
</script>
