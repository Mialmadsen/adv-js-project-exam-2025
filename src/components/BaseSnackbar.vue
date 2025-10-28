<script setup>
import { useSnackbar } from '@/composables/useSnackbar'
const { state, hideSnack } = useSnackbar()
</script>

<template>
  <transition name="slide-down">
    <div
      v-if="state.open"
      class="fixed top-4 left-1/2 -translate-x-1/2 z-[1000]
             flex items-center justify-center
             min-w-[280px] max-w-[90vw]
             px-6 py-3 rounded-md shadow-lg cursor-pointer
             bg-accent text-on-brand-text font-title text-lg tracking-wide"
      @click="hideSnack"
      role="status"
    >
      <i class="fa-solid fa-circle-info mr-3 text-on-brand-text/90"></i>
      {{ state.text }}
    </div>
  </transition>
</template>

<style>
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.25s ease;
}
</style>
