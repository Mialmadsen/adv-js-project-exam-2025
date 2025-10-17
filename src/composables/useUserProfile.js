import { ref, watch, onUnmounted } from 'vue'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/modules/firebase'
import { useAuth } from '@/modules/useAuth'

const profile = ref(null)
const loading = ref(false)
const error = ref(null)

let unsub = null

function stop() {
  if (unsub) { unsub(); unsub = null }
}

export function useUserProfile() {
  const { currentUser, authReady } = useAuth()

  const load = () => {
    stop()
    if (!currentUser.value) {
      profile.value = null
      return
    }
    loading.value = true
    const refDoc = doc(db, 'users', currentUser.value.uid)
    unsub = onSnapshot(refDoc,
      snap => {
        profile.value = snap.exists() ? { id: snap.id, ...snap.data() } : null
        loading.value = false
        error.value = null
      },
      e => { error.value = e; loading.value = false }
    )
  }

  // Load once auth state is known, and whenever user changes.
  watch(authReady, ready => { if (ready) load() }, { immediate: true })
  watch(currentUser, () => load())

  onUnmounted(stop)

  return { profile, loading, error, reload: load }
}
