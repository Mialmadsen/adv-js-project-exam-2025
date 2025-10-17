<script setup>
import BaseButton from '../BaseButton.vue';

const {stats} = defineProps({
  open: { type: Boolean, default: false },
  stats: { type: Object, default: () => ({}) }
})
const emit = defineEmits(['close'])

function pct(part, total) {
  if (!total) return 0
  return Math.round((part / total) * 100)
}
</script>

<template>
  <teleport to="body">
    <div v-if="open" class="fixed inset-0 z-50">
      <div class="absolute inset-0 bg-brand/20 backdrop-blur-[2px]" @click="emit('close')"></div>

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="w-full max-w-2xl rounded-md bg-on-brand-text/70 backdrop-blur-[2px] shadow-md">
          <!-- header -->
          <div class="px-5 py-4 border-b border-black/10 flex items-center justify-between">
            <h3 class="font-title text-xl text-accent">User statistics</h3>
            <button class="text-text/60 hover:text-text" @click="emit('close')">✕</button>
          </div>

          <!-- content -->
          <div class="px-5 py-5 space-y-6">
            <!-- Totals -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div class="p-3 rounded-md bg-brand/20">
                <div class="text-xs font-title text-text/60">Total users</div>
                <div class="text-2xl font-title">{{ stats.total ?? 0 }}</div>
              </div>
              <div class="p-3 rounded-md  bg-brand/20">
                <div class="text-xs font-title text-text/60">Registered</div>
                <div class="text-2xl font-title">{{ stats.registered ?? 0 }}</div>
              </div>
              <div class="p-3 rounded-md  bg-brand/20">
                <div class="text-xs font-title text-text/60">Not registered</div>
                <div class="text-2xl font-title">{{ stats.nonregistered ?? 0 }}</div>
              </div>
              <div class="p-3 rounded-md bg-brand/20">
                <div class="text-xs font-title text-text/60">Verified %</div>
                <div class="text-2xl font-title">{{ stats.verifiedPct ?? 0 }}%</div>
              </div>
            </div>

            <!-- Gender split (bar) -->
            <div>
              <div class="font-title text-text/80 mb-2">Gender split</div>
              <div class="space-y-2">
                <div v-for="(count, label) in stats.genderCounts || {}" :key="label">
                  <div class="flex items-center justify-between text-sm">
                    <span>{{ label }}</span>
                    <span class="opacity-70">{{ count }} ({{ pct(count, stats.total) }}%)</span>
                  </div>
                  <div class="h-2 bg-black/10 rounded">
                    <div class="h-2 bg-teal rounded" :style="{ width: pct(count, stats.total) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Nationalities (bar list) -->
            <div>
              <div class="font-title text-text/80 mb-2">Top nationalities</div>
              <div class="space-y-2">
                <div
                  v-for="[nat, count] in stats.nationalityCounts || []"
                  :key="nat"
                >
                  <div class="flex items-center justify-between text-sm">
                    <span>{{ nat }}</span>
                    <span class="opacity-70">{{ count }} ({{ pct(count, stats.total) }}%)</span>
                  </div>
                  <div class="h-2 bg-black/10 rounded">
                    <div class="h-2 bg-accent rounded" :style="{ width: pct(count, stats.total) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- footer -->
          <div class="px-5 py-4 border-t border-black/10 flex items-center justify-end">
            <BaseButton variant="outline"  size="sm" @click="emit('close')">
              Close
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
