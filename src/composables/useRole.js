// --- Imports ---
import { ref, computed, watch } from 'vue'
import { useAuth } from '../modules/useAuth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../modules/firebase'

// --- Reactive role state, default is 'guest' ---
const role = ref('guest')

// --- Helpers to check role flags and permissions ---
const makeFlag = (name) => computed(() => role.value === name) // true if current role matches
const allow = (...names) => computed(() => names.includes(role.value)) // true if role is in allowed list
const setRole = (name) => {
  role.value = name
} // manually set role

// --- Fetch user role from Firestore by user id ---
const fetchUserRole = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))
    if (userDoc.exists()) {
      return userDoc.data().role || 'user' // fallback to 'user' if no role
    }
    return 'user'
  } catch (error) {
    console.error('Failed to fetch user role:', error)
    return 'user'
  }
}

// --- Main composable function ---
export function useRole() {
  // Get currentUser from auth composable
  const { currentUser } = useAuth()

  // --- Update role when user changes (login/logout) ---
  const updateRole = async () => {
    if (!currentUser.value) {
      role.value = 'guest'
    } else {
      const fetchedRole = await fetchUserRole(currentUser.value.uid)
      role.value = fetchedRole
    }
  }

  // --- Watch for changes in currentUser and update role immediately ---
  watch(
    currentUser,
    () => {
      updateRole()
    },
    { immediate: true },
  )

  // --- Expose role state and helpers ---
  return {
    role, // current role value
    isGuest: makeFlag('guest'), // true if guest
    isUser: makeFlag('user'), // true if user
    isAdmin: makeFlag('admin'), // true if admin
    allow, // function to check if role is allowed
    setRole, // manually set role
    updateRole, // manually trigger role update
  }
}
