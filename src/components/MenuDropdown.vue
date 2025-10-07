<script setup>
import { ref, computed } from 'vue'
import { useClickOutside } from '@/composables/useClickOutside'

const props = defineProps({
  align:  { type: String, default: 'left' }, // 'left' | 'right'
  width:  { type: String, default: 'w-56' }, // tailwind width class
  offset: { type: String, default: 'mt-4' }, // vertical gap under trigger
})

const open = ref(false)
const wrap = ref(null)

const toggle = () => (open.value = !open.value)
const close  = () => (open.value = false)

useClickOutside(wrap, close)

const panelClass = computed(() =>
  `absolute ${props.align === 'right' ? 'right-0' : 'left-0'} ${props.offset} ${props.width} rounded-md bg-teal shadow-lg`
)
</script>

<template>
  <div ref="wrap" class="relative">
    <!-- trigger slot: you pass the button (so you can style it + set the icon) -->
    <slot name="trigger" :open="open" :toggle="toggle" />

    <!-- panel -->
    <div v-if="open" :class="panelClass">
      <!-- default slot: your list items (with any icons you want) -->
      <slot :close="close" />
    </div>
  </div>
</template>
