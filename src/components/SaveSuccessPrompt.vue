<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps({
  open: { type: Boolean, default: false },        // v-model:open
  title: { type: String, default: 'Success' },
  message: {
    type: String,
    default: 'Your changes have been successfully saved. Would you like to leave the page?'
  },
  confirmLabel: { type: String, default: 'Yes' },
  cancelLabel:  { type: String, default: 'No' },
  // Optional: where to go on "Yes" (route name/path/object)
  to: { type: [String, Object], default: () => ({ name: 'admin-races' }) }
})

const emit = defineEmits(['update:open', 'confirm', 'cancel'])
const router = useRouter()

function close()  { emit('update:open', false) }
function cancel() { emit('cancel'); close() }

async function confirm() {
  emit('confirm')
  if (props.to) await router.push(props.to)
  close()
}

// close on ESC and on backdrop click
function onKey(e) { if (e.key === 'Escape') close() }

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24"
      @click.self="close"
    >
      <!-- dim/backdrop -->
      <div class="absolute inset-0 bg-brand/20 backdrop-blur-[2px]"></div>

      <!-- card -->
      <div
        class="relative bg-on-brand-text/70 backdrop-blur-[2px] shadow-md rounded-md
                w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95"
      >
        <h3 class="font-title text-2xl text-accent mb-2">{{ title }}</h3>
        <p class="font-body text-text/80 mb-6">
          {{ message }}
        </p>

        <div class="flex gap-3 justify-end">
          <BaseButton variant="outline" size="sm" @click="cancel">{{ cancelLabel }}</BaseButton>
          <BaseButton variant="solid" size="sm" @click="confirm">{{ confirmLabel }}</BaseButton>
        </div>
      </div>
    </div>
  </teleport>
</template>
