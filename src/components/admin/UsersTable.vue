<script setup>
const props = defineProps({
  users: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  errorMsg: { type: String, default: '' },
  sortKey: { type: String, default: null },
  sortDir: { type: String, default: 'asc' }, // 'asc' | 'desc'
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
      class="bg-accent/20 border-text/10 font-title hidden grid-cols-12 gap-3 border-b py-2 pl-1 text-sm md:grid"
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

    <div v-if="loading" class="text-text/70 py-6">Loading…</div>
    <p v-else-if="errorMsg" class="text-danger py-6">{{ errorMsg }}</p>

    <!-- Rows -->
    <div
      v-else
      v-for="u in users"
      :key="u.id"
      class="border-text/10 hover:bg-teal/50 grid cursor-pointer grid-cols-2 items-center gap-2 border-b py-2 pl-1 text-sm md:grid-cols-12 md:gap-3"
      @click="emit('select', u)"
    >
      <!-- Name -->
      <div class="col-span-2 min-w-0 md:col-span-4">
        <span class="block text-[11px] tracking-wide uppercase opacity-60 md:hidden">Name</span>
        <div class="font-title truncate">{{ u.fullName || '—' }}</div>
      </div>

      <!-- Email -->
      <div class="col-span-2 min-w-0 md:col-span-3">
        <span class="block text-[11px] tracking-wide uppercase opacity-60 md:hidden">Email</span>
        <div class="truncate">{{ u.email || '—' }}</div>
      </div>

      <!-- Age -->
      <div class="col-span-1 md:col-span-1">
        <span class="block text-[11px] tracking-wide uppercase opacity-60 md:hidden">Age</span>
        <div>{{ u.age ?? '—' }}</div>
      </div>

      <!-- Gender -->
      <div class="col-span-1 md:col-span-2">
        <span class="block text-[11px] tracking-wide uppercase opacity-60 md:hidden">Gender</span>
        <div class="truncate">{{ u.gender || '—' }}</div>
      </div>

      <!-- Nationality -->
      <div class="col-span-2 min-w-0 md:col-span-2">
        <span class="block text-[11px] tracking-wide uppercase opacity-60 md:hidden"
          >Nationality</span
        >
        <div class="truncate">{{ u.nationality || '—' }}</div>
      </div>
    </div>
  </section>
</template>
