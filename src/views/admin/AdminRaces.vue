<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/modules/firebase'
import BaseButton from '@/components/BaseButton.vue'
import BackButton from '@/components/BackButton.vue'

const router = useRouter()
const races = ref([])
const loading = ref(true)
const error = ref(null)

const deleteRace = async (id, title) => {
  const confirmDelete = confirm(`Delete race "${title}"? This cannot be undone.`)
  if (!confirmDelete) return

  try {
    await deleteDoc(doc(db, 'races', id))
    races.value = races.value.filter((r) => r.id !== id) // update UI
  } catch (e) {
    error.value = e?.message ?? String(e)
  }
}

onMounted(async () => {
  try {
    const q = query(collection(db, 'races'), orderBy('title'))
    const snap = await getDocs(q)
    races.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (e) {
    error.value = e?.message ?? String(e)
  } finally {
    loading.value = false
  }
})

// helpers
const fmt = (n, unit = '') => (n ?? '—') + (n != null && unit ? ` ${unit}` : '')
const totalText = (r) =>
  `${fmt(r.lengthKm, 'km')} (run: ${fmt(r.runKm, 'km')} • swim: ${fmt(r.swimKm, 'km')})`
const priceText = (r) => (r?.price != null ? `DKK ${r.price}` : '—')
const timeLimit = (r) => (r?.limits?.timeHours ? `${r.limits.timeHours} h` : '—')
const partLimit = (r) => r?.limits?.participantLimit ?? '—'
const dateText = (r) => r?.date || '—'
const editRace = (id) => router.push({ name: 'admin-race-edit', params: { id } })
const createRace = () => router.push({ name: 'admin-race-new' })

// header color cycle (fits your palette)
const headerHues = [
  'bg-accent', // purple
  'bg-brand', // blue
  'bg-cyan', // sky
  'bg-teal', // teal
]
const colColor = (i) => headerHues[i % headerHues.length]
</script>

<template>
  <section class="space-y-6">
    <header>
      <h1 class="font-title text-accent text-3xl">Races</h1>
    </header>

    <!-- Loading / error / empty -->
    <div v-if="loading" class="admin-card text-text/70">Loading…</div>
    <div v-else-if="error" class="admin-card text-danger">{{ error }}</div>
    <div v-else-if="!races.length" class="admin-card text-text/70 text-center">No races yet.</div>

    <!-- MOBILE: stacked cards -->
    <div v-else class="grid gap-4">
      <div class="mt-4 flex justify-end">
        <BaseButton variant="solid" size="sm" @click="createRace">+ New race</BaseButton>
      </div>

      <article v-for="(r, i) in races" :key="r.id" class="admin-card">
        <div :class="['text-on-brand-text font-title rounded-md px-4 py-3 text-lg', colColor(i)]">
          {{ r.title }}
        </div>

        <dl
          class="divide-text/10 ring-teal/20 bg-on-brand-text/80 mt-4 divide-y overflow-hidden rounded-md ring-1"
        >
          <div class="grid grid-cols-2 gap-3 px-4 py-3">
            <dt class="font-title text-text/80">Total (run • swim)</dt>
            <dd class="font-body text-text/90 text-right">{{ totalText(r) }}</dd>
          </div>
          <div class="grid grid-cols-2 gap-3 px-4 py-3">
            <dt class="font-title text-text/80">Price</dt>
            <dd class="font-body text-text/90 text-right">{{ priceText(r) }}</dd>
          </div>
          <div class="grid grid-cols-2 gap-3 px-4 py-3">
            <dt class="font-title text-text/80">Time limit</dt>
            <dd class="font-body text-text/90 text-right">{{ timeLimit(r) }}</dd>
          </div>
          <div class="grid grid-cols-2 gap-3 px-4 py-3">
            <dt class="font-title text-text/80">Date</dt>
            <dd class="font-body text-text/90 text-right">{{ dateText(r) }}</dd>
          </div>
          <div class="grid grid-cols-2 gap-3 px-4 py-3">
            <dt class="font-title text-text/80">Participants</dt>
            <dd class="font-body text-text/90 text-right">{{ partLimit(r) }}</dd>
          </div>
        </dl>

        <div class="mt-4 flex justify-between">
          <BaseButton variant="outline" size="sm" @click="deleteRace(r.id, r.title)">
            Delete
          </BaseButton>
          <BaseButton variant="solid" size="sm" @click="editRace(r.id)">Edit</BaseButton>
        </div>
      </article>
    </div>
    <BackButton size="sm" />
  </section>
</template>
