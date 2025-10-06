<script setup>
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps({
  title:     { type: String, default: '' },
  length:    { type: String, default: '' },
  location:  { type: String, default: '' },
  date:      { type: String, default: '' },
  to:        { type: [String, Object], default: null }, // RouterLink target
  image:     { type: String, default: '' }              // optional header image
})
</script>

<template>
  <article
    class="group relative flex w-fill-content flex-col rounded-md text-text
           ring-1 ring-teal/40 transition hover:ring-teal hover:-translate-y-0.5"
  >
    <!-- top media block (image or brand gradient) -->
    <div class="relative mx-6 -mt-8 h-40 overflow-hidden rounded-md shadow-lg">
      <img v-if="image" :src="image" alt="" class="h-full w-full object-cover" />
      <div v-else class="h-full w-full bg-[image:var(--color-gradient)]"></div>
    </div>

    <!-- body -->
     <div class="flex flex-row p-6  ustify-between items-end">
    <div class="p-6">
      <h3 class="font-title text-2xl text-accent mb-2">{{ title }}</h3>
      <ul class="font-body text-base text-text/80 space-y-0.5">
        <li v-if="length"><span class="text-text font-semibold">Length</span> • {{ length }}</li>
        <li v-if="location"><span class="text-text font-semibold">Location</span> • {{ location }}</li>
        <li v-if="date"><span class="text-text font-semibold">Date</span> • {{ date }}</li>
      </ul>
    </div>

    <!-- action -->
    <div class="p-6 pt-0">
      <RouterLink v-if="to" :to="to">
        <BaseButton>View race</BaseButton>
      </RouterLink>
    </div>
  </div>
  </article>
</template>
