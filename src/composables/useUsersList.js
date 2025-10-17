import { ref, computed } from 'vue'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/modules/firebase'

export function useUsersList() {
  const users = ref([])
  const loading = ref(false)
  const errorMsg = ref('')

  async function load() {
    loading.value = true
    errorMsg.value = ''
    try {
      const snap = await getDocs(collection(db, 'users'))
      users.value = snap.docs.map(d => {
        const data = d.data() || {}
        return {
          id: d.id,
          fullName: data.fullName ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
          age: data.age ?? null,
          gender: data.gender ?? '',
          nationality: data.nationality ?? '',
          shirtSize: data.shirtSize ?? '',
          registrationsCount: Number.isFinite(data.registrationsCount) ? data.registrationsCount : 0,
          bib: Number.isFinite(data.bib) ? data.bib : null,
          registered:
    (Number.isFinite(data.registrationsCount) && data.registrationsCount > 0) ||
     Number.isFinite(data.bib),
          emailVerified: data.emailVerified ?? false,
          createdAt: data.createdAt ?? null,  // Firestore Timestamp or null
          disabled: data.disabled ?? false
        }
      })
      return true
    } catch (err) {
      console.error('[useUsersList] load failed:', err)
      errorMsg.value = 'Failed to load users.'
      return false
    } finally {
      loading.value = false
    }
  }
  const refresh = load

  // ---- sorting state
  const sortKey = ref(null)          // e.g., 'age' | 'gender' | 'nationality' | 'registrationsCount'
  const sortDir = ref('asc')         // 'asc' | 'desc'

  function setSort(key) {
    if (sortKey.value === key) {
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortKey.value = key
      sortDir.value = 'asc'
    }
  }

  const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true })
  const accessors = {
    age: r => r.age ?? Number.NEGATIVE_INFINITY,
    gender: r => r.gender || '',
    nationality: r => r.nationality || '',
    registrationsCount: r => r.registrationsCount ?? 0,
    fullName: r => r.fullName || '',
    email: r => r.email || '',
    emailVerified: r => (r.emailVerified ? 1 : 0),
    createdAt: r => (r.createdAt && r.createdAt.toMillis ? r.createdAt.toMillis() : -1),
  }

  const sortedUsers = computed(() => {
    const arr = [...users.value]
    const key = sortKey.value
    if (!key) return arr
    const get = accessors[key] || (r => r[key])
    const dir = sortDir.value === 'asc' ? 1 : -1

    return arr.sort((a, b) => {
      const va = get(a)
      const vb = get(b)
      const aNum = typeof va === 'number'
      const bNum = typeof vb === 'number'
      if (aNum && bNum) return (va - vb) * dir
      // strings / mixed -> collator
      return collator.compare(String(va ?? ''), String(vb ?? '')) * dir
    })
  })

  return {
    // data
    users, loading, errorMsg,
    // io
    load, refresh,
    // sorting
    sortedUsers, sortKey, sortDir, setSort
  }
}
