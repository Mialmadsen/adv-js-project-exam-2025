<script setup>

import BaseButton from '../BaseButton.vue';

const { open, user, registrations, loadingRegs }  = defineProps({
  open: { type: Boolean, default: false },
  user: { type: Object, default: null }, // expects { id, fullName, email, emailVerified, disabled, ... }
  registrations: { type: Array, default: () => [] }, // list of race registrations (we’ll load later)
  loadingRegs: { type: Boolean, default: false }
})
const emit = defineEmits(['close', 'contact'])
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50">
      <!-- backdrop -->
      <div class="absolute inset-0 bg-brand/20 backdrop-blur-[2px]" @click="emit('close')"></div>

      <!-- card -->
      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-xl rounded-md bg-on-brand-text/70 backdrop-blur-[2px] shadow-md">
          <!-- header -->
          <div class="px-5 py-4 border-b border-brand/10 flex items-center justify-between">
            <h3 class="font-title text-xl text-accent">
              {{ user?.fullName || 'User' }}
            </h3>

          </div>

          <!-- content -->
          <div class="px-5 py-4 space-y-4">
            <!-- email + status -->
            <div class="flex flex-wrap items-center gap-3">
              <div class="min-w-0">
                <div class="text-sm font-title text-text">Email</div>
                <div class="text-sm break-all">{{ user?.email || '—' }}</div>
              </div>
              <span
                class="ml-auto inline-block rounded-md px-2 py-1 text-xs font-title"
                :class="user?.emailVerified ? 'bg-brand/20 text-brand/80' : 'bg-danger/20 text-danger/80'"
              >
                {{ user?.emailVerified ? 'Verified' : 'Not verified' }}
              </span>
            </div>

            <!-- quick facts -->
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div><span class="font-title text-text">Age:</span> {{ user?.age ?? '—' }}</div>
              <div><span class="font-title text-text">Phone:</span> {{ user?.phone || '—' }}</div>
              <div><span class="font-title text-text">Gender:</span> {{ user?.gender || '—' }}</div>
              <div><span class="font-title text-text">Nationality:</span> {{ user?.nationality || '—' }}</div>
              <div><span class="font-title text-text">Size:</span> {{ user?.shirtSize || '—' }}</div>
            </div>

            <!-- registrations -->
            <div>
              <div class="font-title text-text mb-2">Race registrations</div>
              <div v-if="loadingRegs" class="text-text/70 text-sm">Loading registrations…</div>
              <div v-else-if="!registrations?.length" class="text-text/70 text-sm">No registrations.</div>
              <ul v-else class="space-y-2 text-sm">
  <li
    v-for="r in registrations"
    :key="r.id"
    class="flex items-center justify-between gap-3"
  >
    <div class="min-w-0 flex items-center gap-2">
      <!-- Bib badge (if present) -->
      <span
        v-if="r.bib !== null && r.bib !== undefined && r.bib !== ''"
        class="inline-flex items-center justify-center rounded-md px-2 py-0.5 text-[11px] font-title bg-brand/20 text-text/90 shrink-0"
        :title="`Bib #${r.bib}`"
      >
        #{{ r.bib }}
      </span>
      <span class="truncate">{{ r.raceTitle || r.raceId || '—' }}</span>
    </div>
    <span class="opacity-70 shrink-0">{{ r.status || '—' }}</span>
  </li>
</ul>
            </div>
          </div>

          <!-- footer actions -->
          <div class="px-5 py-4 border-t border-brand/10 flex items-center justify-between">
            <BaseButton variant="outline" size="sm"  @click="emit('close')">
              Close
            </BaseButton>

            <BaseButton variant="solid" size="sm"


              @click="emit('contact', user)"
            >
             Contact user
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
