<script setup>
const props = defineProps({
  users: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  errorMsg: { type: String, default: '' },
  sortKey: { type: String, default: null },
  sortDir: { type: String, default: 'asc' } // 'asc' | 'desc'
})

const emit = defineEmits(['sort', 'select'])

function askSort(key) {
  emit('sort', key)
}
function iconFor(key) {
  if (props.sortKey !== key) return '↕'
  return props.sortDir === 'asc' ? '▲' : '▼'
}
</script>

<template>
  <section class="admin-card">
    <!-- Header (desktop/tablet) -->
    <div
      class="hidden md:grid grid-cols-12 gap-3 pl-1 py-2 border-b bg-accent/20 border-text/10 text-sm font-title"
    >

      <button class="col-span-4 flex items-center gap-1 text-left" @click="askSort('fullName')">
        <span>Name</span><span class="text-xs opacity-70">{{ iconFor('fullName') }}</span>
      </button>
      <button class="col-span-3 flex items-center gap-1 text-left" @click="askSort('email')">
        <span>Email</span><span class="text-xs opacity-70">{{ iconFor('email') }}</span>
      </button>
      <button class="col-span-1 flex items-center gap-1 text-left" @click="askSort('age')">
        <span>Age</span><span class="text-xs opacity-70">{{ iconFor('age') }}</span>
      </button>
      <button class="col-span-2 flex items-center gap-1 text-left" @click="askSort('gender')">
        <span>Gender</span><span class="text-xs opacity-70">{{ iconFor('gender') }}</span>
      </button>
      <button class="col-span-2 flex items-center gap-1 text-left" @click="askSort('nationality')">
        <span>Nationality</span><span class="text-xs opacity-70">{{ iconFor('nationality') }}</span>
      </button>
    </div>

    <div v-if="loading" class="py-6 text-text/70">Loading…</div>
    <p v-else-if="errorMsg" class="text-danger py-6">{{ errorMsg }}</p>

    <!-- Rows -->
    <div
      v-else
      v-for="u in users"
      :key="u.id"
      class="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-3 pl-1 py-2 border-b border-text/10 text-sm items-center cursor-pointer hover:bg-teal/50"
      @click="emit('select', u)"
    >
      <!-- Name -->
      <div class="col-span-2 md:col-span-4 min-w-0">
        <span class="md:hidden block text-[11px] uppercase tracking-wide opacity-60">Name</span>
        <div class="font-title truncate">{{ u.fullName || '—' }}</div>
      </div>

      <!-- Email -->
      <div class="col-span-2 md:col-span-3 min-w-0">
        <span class="md:hidden block text-[11px] uppercase tracking-wide opacity-60">Email</span>
        <div class="truncate">{{ u.email || '—' }}</div>
      </div>

      <!-- Age -->
      <div class="col-span-1 md:col-span-1">
        <span class="md:hidden block text-[11px] uppercase tracking-wide opacity-60">Age</span>
        <div>{{ u.age ?? '—' }}</div>
      </div>

      <!-- Gender -->
      <div class="col-span-1 md:col-span-2">
        <span class="md:hidden block text-[11px] uppercase tracking-wide opacity-60">Gender</span>
        <div class="truncate">{{ u.gender || '—' }}</div>
      </div>

      <!-- Nationality -->
      <div class="col-span-2 md:col-span-2 min-w-0">
        <span class="md:hidden block text-[11px] uppercase tracking-wide opacity-60">Nationality</span>
        <div class="truncate">{{ u.nationality || '—' }}</div>
      </div>
    </div>
  </section>
</template>
