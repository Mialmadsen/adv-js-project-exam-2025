<script setup>
import BaseButton from '../BaseButton.vue'

const { stats } = defineProps({
  open: { type: Boolean, default: false },
  stats: { type: Object, default: () => ({}) },
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
      <div class="bg-brand/20 absolute inset-0 backdrop-blur-[2px]" @click="emit('close')"></div>

      <div class="absolute inset-0 flex items-center justify-center p-4">
        <div class="bg-on-brand-text/70 w-full max-w-2xl rounded-md shadow-md backdrop-blur-[2px]">
          <!-- header -->
          <div class="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <h3 class="font-title text-accent text-xl">User statistics</h3>
            <button class="text-text/60 hover:text-text" @click="emit('close')">✕</button>
          </div>

          <!-- content -->
          <div class="space-y-6 px-5 py-5">
            <!-- Totals -->
            <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div class="bg-brand/20 rounded-md p-3">
                <div class="font-title text-text/60 text-xs">Total users</div>
                <div class="font-title text-2xl">{{ stats.total ?? 0 }}</div>
              </div>
              <div class="bg-brand/20 rounded-md p-3">
                <div class="font-title text-text/60 text-xs">Registered</div>
                <div class="font-title text-2xl">{{ stats.registered ?? 0 }}</div>
              </div>
              <div class="bg-brand/20 rounded-md p-3">
                <div class="font-title text-text/60 text-xs">Not registered</div>
                <div class="font-title text-2xl">{{ stats.nonregistered ?? 0 }}</div>
              </div>
              <div class="bg-brand/20 rounded-md p-3">
                <div class="font-title text-text/60 text-xs">Verified %</div>
                <div class="font-title text-2xl">{{ stats.verifiedPct ?? 0 }}%</div>
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
                  <div class="h-2 rounded bg-black/10">
                    <div
                      class="bg-teal h-2 rounded"
                      :style="{ width: pct(count, stats.total) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Nationalities (bar list) -->
            <div>
              <div class="font-title text-text/80 mb-2">Top nationalities</div>
              <div class="space-y-2">
                <div v-for="[nat, count] in stats.nationalityCounts || []" :key="nat">
                  <div class="flex items-center justify-between text-sm">
                    <span>{{ nat }}</span>
                    <span class="opacity-70">{{ count }} ({{ pct(count, stats.total) }}%)</span>
                  </div>
                  <div class="h-2 rounded bg-black/10">
                    <div
                      class="bg-accent h-2 rounded"
                      :style="{ width: pct(count, stats.total) + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- footer -->
          <div class="flex items-center justify-end border-t border-black/10 px-5 py-4">
            <BaseButton variant="outline" size="sm" @click="emit('close')"> Close </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>
