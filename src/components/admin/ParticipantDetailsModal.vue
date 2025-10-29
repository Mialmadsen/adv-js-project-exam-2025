<script setup>
import BaseButton from '@/components/BaseButton.vue'

const { participant } = defineProps({
  open: { type: Boolean, default: false },
  participant: { type: Object, default: null }, // expects mapped participant object
})
const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>

<template>
  <teleport to="body">
    <div v-if="open && participant" class="fixed inset-0 z-50">
      <!-- backdrop -->
      <div class="bg-brand/20 absolute inset-0 backdrop-blur-[2px]" @click="close"></div>

      <!-- card -->
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-on-brand-text/70 w-full max-w-xl rounded-md shadow-md backdrop-blur-[2px]">
          <!-- header -->
          <div class="border-brand/10 flex items-center justify-between border-b px-5 py-4">
            <h3 class="font-title text-accent text-xl">
              {{ participant.fullName || 'Participant' }}
              <span class="text-text/60" v-if="participant.bib"> #{{ participant.bib }}</span>
            </h3>
          </div>

          <!-- content -->
          <div class="space-y-4 px-5 py-4 text-sm">
            <!-- contact -->
            <div class="flex flex-wrap items-center gap-3">
              <div class="min-w-0">
                <div class="font-title text-text text-sm">Email</div>
                <div class="text-sm break-all">{{ participant.email || '—' }}</div>
              </div>
              <span
                class="font-title bg-brand/20 text-brand/80 ml-auto inline-block rounded-md px-2 py-1 text-xs"
              >
                {{ (participant.raceId || '—').toUpperCase() }}
              </span>
            </div>

            <!-- quick facts -->
            <div class="grid grid-cols-2 gap-3">
              <div><span class="font-title text-text">Age:</span> {{ participant.age ?? '—' }}</div>
              <div>
                <span class="font-title text-text">Sex:</span> {{ participant.gender || '—' }}
              </div>
              <div>
                <span class="font-title text-text">Nationality:</span>
                {{ participant.nationality || '—' }}
              </div>
              <div><span class="font-title text-text">Bib:</span> {{ participant.bib ?? '—' }}</div>
              <div>
                <span class="font-title text-text">Size:</span> {{ participant.shirtSize || '—' }}
              </div>
              <div>
                <span class="font-title text-text">Registered:</span>
                {{ participant.createdAt ? new Date(participant.createdAt).toLocaleString() : '—' }}
              </div>
            </div>

            <!-- extras / payment -->
            <div class="grid grid-cols-2 gap-3">
              <div>
                <span class="font-title text-text">T-shirt:</span>
                {{ participant.tshirt ? 'Yes' : 'No' }}
              </div>
              <div>
                <span class="font-title text-text">Medal:</span>
                {{ participant.medal ? 'Yes' : 'No' }}
              </div>
              <div class="col-span-2">
                <span class="font-title text-text">Total:</span> {{ participant.total ?? '—' }}
              </div>
            </div>
          </div>

          <!-- footer -->
          <div class="border-brand/10 flex items-center justify-end gap-2 border-t px-5 py-4">
            <BaseButton variant="outline" size="sm" @click="close">Close</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
