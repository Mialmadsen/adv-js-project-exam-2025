<script setup>
import { ref } from 'vue'
import { seedRacesToFirestore } from '@/services/racesSeed'

const busy = ref(false)
const msg  = ref('')

async function runSeed() {
  try {
    busy.value = true
    msg.value = ''
    await seedRacesToFirestore()
    msg.value = '✅ Races seeded to Firestore.'
  } catch (e) {
    console.error(e)
    msg.value = '❌ Failed. See console.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto py-10 space-y-4">
    <h1 class="font-title text-2xl text-accent">Dev: Seed Firestore</h1>
    <p class="font-body text-text/80">
      Writes/updates the <code>races</code> collection with <b>hard</b> and <b>light</b>.
    </p>

    <button
      class="rounded-md px-4 py-2 bg-brand text-on-brand-text disabled:opacity-60"
      :disabled="busy"
      @click="runSeed"
    >
      {{ busy ? 'Seeding…' : 'Seed races' }}
    </button>

    <p v-if="msg" class="font-body">{{ msg }}</p>
  </div>
</template>
