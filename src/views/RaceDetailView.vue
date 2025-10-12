<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { db } from '@/modules/firebase'
import { doc, getDoc } from 'firebase/firestore'

import Container from '@/components/layout/Container.vue'
import RaceDetail from '@/components/layout/RaceDetail.vue'

const route   = useRoute()
const loading = ref(true)
const error   = ref('')
const race    = ref(null)

async function loadRace(id) {
  loading.value = true
  error.value   = ''
  race.value    = null
  try {
    const snap = await getDoc(doc(db, 'races', String(id)))
    if (!snap.exists()) {
      error.value = `Race "${id}" not found.`
      return
    }
    race.value = { id: snap.id, ...snap.data() }
  } catch (e) {
    error.value = e.message || 'Failed to load race.'
  } finally {
    loading.value = false
  }
}

onMounted(() => loadRace(route.params.id))
watch(() => route.params.id, (id) => loadRace(id))
</script>

<template>
  <Container>
    <div class="py-8 space-y-4">
      <p v-if="loading" class="text-text/70">Loading race…</p>
      <p v-else-if="error" class="text-danger">{{ error }}</p>
      <RaceDetail v-else-if="race" :race="race" />
      <p v-else class="text-text/70">No data.</p>
    </div>
  </Container>
</template>
