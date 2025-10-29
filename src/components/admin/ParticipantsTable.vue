<script setup>
defineProps({
  participants: { type: Array, default: () => [] },
  admin: { type: Boolean, default: false }, // if you ever want admin-only columns here
  firstNameFn: { type: Function, default: (n) => (n || '').trim().split(/\s+/)[0] || '' },
})
const emit = defineEmits(['select'])

function onRowClick(p) {
  // emit only for admin (public click does nothing)
  emit('select', p)
}
</script>

<template>
  <table class="min-w-full text-sm">
    <thead class="bg-accent/20">
      <tr class="text-left uppercase">
        <th class="px-4 py-2.5">Name</th>
        <th class="px-4 py-2.5">Age</th>
        <th class="px-4 py-2.5">Nationality</th>
        <th class="px-4 py-2.5">Sex</th>
        <th class="px-4 py-2.5">Bib</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="p in participants"
        :key="p.id"
        class="border-text/5 hover:bg-bg/40 cursor-pointer border-t"
        @click="onRowClick(p)"
        :title="`Open ${p.fullName || 'participant'} details`"
      >
        <td class="px-4 py-2.5 font-medium">
          {{ firstNameFn(p.fullName) || '—' }}
        </td>
        <td class="px-4 py-2.5">{{ p.age ?? '—' }}</td>
        <td class="px-4 py-2.5">{{ p.nationality || '—' }}</td>
        <td class="px-4 py-2.5">{{ p.gender || '—' }}</td>
        <td class="px-4 py-2.5">{{ p.bib ?? '—' }}</td>
      </tr>
    </tbody>
  </table>
</template>
