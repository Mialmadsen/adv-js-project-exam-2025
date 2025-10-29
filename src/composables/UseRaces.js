import { ref } from 'vue'
import { db } from '@/modules/firebase'
import { collection, getDocs } from 'firebase/firestore'

export function useRaces() {
  const races = ref([])
  const loading = ref(false)
  const error = ref('')

  async function loadAll() {
    loading.value = true
    error.value = ''
    try {
      const snap = await getDocs(collection(db, 'races'))
      races.value = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (a.title || '').localeCompare(b.title || ''))
    } catch (e) {
      error.value = e.message || 'Failed to load races.'
    } finally {
      loading.value = false
    }
  }

  return { races, loading, error, loadAll }
}
