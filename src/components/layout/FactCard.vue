<script setup>
const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
})
</script>

<template>
  <!-- no background here; the parent bar provides bg + dividers -->
  <div class="h-full flex items-center gap-4 px-5 py-4 text-text  hover:bg-teal/40">
    <!-- icon circle (slot) -->
    <div class="shrink-0 grid place-items-center w-12 h-12 rounded-full bg-black/70">
      <slot name="icon">
        <i class="fa-solid fa-circle-info text-on-brand-text"></i>
      </slot>
    </div>

    <!-- texts -->
    <div>
      <div class="font-body text-text/80">{{ props.label }}</div>
      <div class="font-title text-2xl leading-tight">{{ props.value }}</div>
    </div>
  </div>
</template>
