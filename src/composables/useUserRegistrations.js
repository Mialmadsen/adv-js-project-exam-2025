import { ref } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/modules/firebase'

export function useUserRegistrations() {
  const registrations = ref([])
  const loading = ref(false)
  const error = ref('')

  async function load(uid) {
    if (!uid) return
    loading.value = true
    error.value = ''
    registrations.value = []
    try {
      const colRef = collection(db, 'users', uid, 'registrations')
      const snap = await getDocs(colRef)
      registrations.value = snap.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          raceId: data.raceId || '',
          raceTitle: data.raceTitle || '',
          status: data.status || 'registered',
          bib: data.bib ?? data.bibNumber ?? null,
          createdAt: data.createdAt ?? null,
        }
      })
    } catch (err) {
      console.error('[useUserRegistrations]', err)
      error.value = 'Failed to load registrations'
    } finally {
      loading.value = false
    }
  }

  return { registrations, loading, error, load }
}
