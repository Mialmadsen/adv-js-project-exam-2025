<script setup>
import { computed } from 'vue'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps({
  title:    { type: String, default: '' },
  length:   { type: Number, default: null },   // keep as Number
  location: { type: String, default: '' },
  date:     { type: String, default: '' },
  to:       { type: [String, Object], default: null },
  image:    { type: String, default: '' }
})

// format inside the card
const lengthText = computed(() =>
  props.length == null || Number.isNaN(props.length) ? '—' : `${props.length} km`
)
</script>

<template>
  <article
    class="group relative flex flex-col rounded-md text-text w-full max-w-[520px] xl:max-w-[560px] mx-auto
           ring-1 ring-teal/40 transition hover:brightness-110 hover:bg-teal/10 hover:ring-offset-2
           hover:ring-offset-bg hover:ring-teal/20 hover:-translate-y-0.5"
  >
    <!-- top media block (image or brand gradient) -->
    <div class="relative mx-6 -mt-8 aspect-[16/9] overflow-hidden rounded-md shadow-lg">
      <img v-if="image" :src="image" :alt="title || 'Race image'" loading="lazy" class="h-full w-full object-cover" />
      <div v-else class="h-full w-full bg-[image:var(--color-gradient)]"></div>
    </div>

    <!-- body -->
    <div class="flex flex-col sm:flex-row p-6 gap-6 justify-between items-center sm:items-stretch">
      <div class="p-2 flex-1">
        <h3 class="font-title text-xl sm:text-2xl text-accent mb-2">{{ title }}</h3>
        <ul class="font-body text-sm sm:text-base text-text/80 space-y-1 whitespace-nowrap">
          <li v-if="length != null">
            <span class="text-text font-semibold">Length</span> • {{ lengthText }}
          </li>
          <li v-if="location"><span class="text-text font-semibold">Location</span> • {{ location }}</li>
          <li v-if="date"><span class="text-text font-semibold">Date</span> • {{ date }}</li>
        </ul>
      </div>

      <!-- action -->
      <div class="p-2 sm:self-end">
        <RouterLink v-if="to" :to="to">
          <BaseButton size="lg">View race</BaseButton>
        </RouterLink>
      </div>
    </div>
  </article>
</template>
