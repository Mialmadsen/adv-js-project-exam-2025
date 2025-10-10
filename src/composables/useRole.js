import { ref, computed, watch } from 'vue'
import { useAuth } from '../modules/useAuth'   // <-- opdateret sti
import { doc, getDoc } from "firebase/firestore"
import { db } from '../modules/firebase'       // <-- opdateret sti

const role = ref('guest') 
const makeFlag = (name) => computed(() => role.value === name)
const allow = (...names) => computed(() => names.includes(role.value))
const setRole = (name) => { role.value = name }

const fetchUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid))
    if (userDoc.exists()) {
      return userDoc.data().role || 'user'
    }
    return 'user'
  } catch (error) {
    console.error("Failed to fetch user role:", error)
    return 'user'
  }
}

export function useRole() {
  const { currentUser } = useAuth()

  const updateRole = async () => {
    if (!currentUser.value) {
      role.value = 'guest'
    } else {
      const fetchedRole = await fetchUserRole(currentUser.value.uid)
      role.value = fetchedRole
    }
  }

  watch(currentUser, () => {
    updateRole()
  }, { immediate: true })

  return {
    role,
    isGuest: makeFlag('guest'),
    isUser: makeFlag('user'),
    isAdmin: makeFlag('admin'),
    allow,
    setRole,
    updateRole
  }
}
