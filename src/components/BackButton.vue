<script setup>
import { computed } from 'vue'

const props = defineProps({
  label:     { type: String,  default: 'Go Back' },
  size:      { type: String,  default: 'md', validator: v => ['sm','md','lg'].includes(v) },
  autoBack:  { type: Boolean, default: true },   // call history.back()
  disabled:  { type: Boolean, default: false },
  // Optional link targets (if provided, we render an <a>)
  href:      { type: String,  default: '' },
  target:    { type: String,  default: '' },
  })

const emit = defineEmits(['click'])

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm': return 'w-8 h-8 hover:w-32 text-sm'
    case 'lg': return 'w-12 h-12 hover:w-48 text-base'
    default:   return 'w-10 h-10 hover:w-40 text-sm'
  }
})


const handleClick = (e) => {
  emit('click', e)
  if (props.disabled) return
  if (props.href) return // let the link navigate
  if (props.autoBack && typeof window !== 'undefined') {
    if (window.history.length > 1) window.history.back()
  }
}
</script>

<template>
  <!-- If href present, render a link; else a button -->
  <component
    :is="href ? 'a' : 'button'"
    :href="href || undefined"
    :target="target || undefined"
    type="button"
    :aria-label="label"
    :disabled="disabled || undefined"
    @click="handleClick"
    class="group relative flex items-center justify-center
           rounded-md bg-on-brand-text/20 backdrop-blur-sm
           transition-all duration-300 overflow-hidden border border-teal text-text
           hover:brightness-110 hover:bg-teal/10 hover:ring-1 hover:ring-offset-2 hover:ring-teal/20 hover:border-teal/20
           focus:outline-none
           uppercase font-title font-semibold
           shadow-none"
    :class="[ sizeClasses,
              disabled ? 'opacity-60 pointer-events-none' : '' ]"
  >
    <!-- Left arrow icon (Font Awesome or fallback arrow) -->
    <span
      class="pointer-events-none leading-none
             transition-transform duration-300
             group-hover:-translate-x-[200%]"
      :class="size === 'md' ? 'text-xl' : 'text-lg'"
      aria-hidden="true"
    >
      <i class="fa-solid fa-arrow-left pr-2"></i>

    </span>

    <!-- Label revealed on hover -->
    <span
      class="absolute inset-0 flex items-center justify-center
             opacity-0 tracking-wide
             transition-opacity duration-300
             group-hover:opacity-100"
    >
      {{ label }}
    </span>
  </component>
</template>


<!--

  <BackButton />


  <BackButton size="sm" />


  <BackButton href="/admin" :autoBack="false" label="Go Back" />
 -->
