
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/modules/firebase'
import BaseButton from '@/components/BaseButton.vue'

const router  = useRouter()
const races   = ref([])
const loading = ref(true)
const error   = ref(null)

onMounted(async () => {
  try {
    const q = query(collection(db, 'races'), orderBy('title'))
    const snap = await getDocs(q)
    races.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
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
const timeLimit = (r) => r?.limits?.timeHours ? `${r.limits.timeHours} h` : '—'
const partLimit = (r) => r?.limits?.participantLimit ?? '—'
const dateText  = (r) => r?.date || '—'
const editRace  = (id) => router.push({ name: 'admin-race-edit', params: { id } })

// header color cycle (fits your palette)
const headerHues = [
  'bg-accent', // purple
  'bg-brand',  // blue
  'bg-cyan',   // sky
  'bg-teal'    // teal
]
const colColor = (i) => headerHues[i % headerHues.length]
</script>

<template>
  <section class="space-y-6">
    <header>
      <h1 class="font-title text-3xl text-accent">Races</h1>
    </header>

    <!-- Loading / error / empty -->
    <div v-if="loading" class="admin-card text-text/70">Loading…</div>
    <div v-else-if="error" class="admin-card text-danger">{{ error }}</div>
    <div v-else-if="!races.length" class="admin-card text-text/70 text-center">
      No races yet.
    </div>

    <!-- MOBILE: stacked cards -->
    <div v-else class="grid gap-4">
      <article
        v-for="(r,i) in races"
        :key="r.id"
        class="admin-card"
      >
        <div :class="['rounded-md px-4 py-3 text-on-brand-text font-title text-lg', colColor(i)]">
          {{ r.title }}
        </div>

        <dl class="mt-4 divide-y divide-text/10 rounded-md overflow-hidden ring-1 ring-teal/20 bg-on-brand-text/80">
          <div class="grid grid-cols-2 gap-3 px-4 py-3">
            <dt class="font-title text-text/80">Total (run • swim)</dt>
            <dd class="text-right font-body text-text/90">{{ totalText(r) }}</dd>
          </div>
          <div class="grid grid-cols-2 gap-3 px-4 py-3">
            <dt class="font-title text-text/80">Price</dt>
            <dd class="text-right font-body text-text/90">{{ priceText(r) }}</dd>
          </div>
          <div class="grid grid-cols-2 gap-3 px-4 py-3">
            <dt class="font-title text-text/80">Time limit</dt>
            <dd class="text-right font-body text-text/90">{{ timeLimit(r) }}</dd>
          </div>
          <div class="grid grid-cols-2 gap-3 px-4 py-3">
            <dt class="font-title text-text/80">Date</dt>
            <dd class="text-right font-body text-text/90">{{ dateText(r) }}</dd>
          </div>
          <div class="grid grid-cols-2 gap-3 px-4 py-3">
            <dt class="font-title text-text/80">Participants</dt>
            <dd class="text-right font-body text-text/90">{{ partLimit(r) }}</dd>
          </div>
        </dl>

        <div class="mt-4 flex justify-end">
          <BaseButton variant="outline" size="sm" @click="editRace(r.id)">Edit</BaseButton>
        </div>
      </article>
    </div>


  </section>
</template>

