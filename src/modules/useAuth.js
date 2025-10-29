import { ref, computed } from 'vue'
import { firebaseApp, db } from './firebase.js'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

const auth = getAuth(firebaseApp)

const currentUser = ref(null)
const authReady = ref(false) // <-- ny
const isLoggedIn = computed(() => !!currentUser.value)
const authError = ref(null)
const loading = ref(false)

onAuthStateChanged(auth, (user) => {
  currentUser.value = user
  authReady.value = true // <-- signaler at auth er klar
})

const login = async (email, password) => {
  loading.value = true
  authError.value = null
  try {
    await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    let errorMessage = ''
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Please enter a valid email address.'
        break
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled.'
        break
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email.'
        break
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Try again.'
        break
      case 'auth/missing-password':
        errorMessage = 'Please enter a password.'
        break
      default:
        errorMessage = 'Login failed. Please try again.'
    }
    console.error(errorMessage)
    authError.value = errorMessage
  } finally {
    loading.value = false
  }
}

const register = async (email, password) => {
  loading.value = true
  authError.value = null
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      role: 'user',
      createdAt: new Date(),
    })
  } catch (error) {
    authError.value = error.message
  } finally {
    loading.value = false
  }
}

const logout = async (routerInstance) => {
  loading.value = true
  authError.value = null
  try {
    await signOut(auth)
    if (routerInstance) routerInstance.push('/')
  } catch (error) {
    authError.value = error.message
  } finally {
    loading.value = false
  }
}

export function useAuth() {
  return {
    currentUser,
    authReady, // <-- eksporter authReady
    isLoggedIn,
    authError,
    loading,
    login,
    logout,
    register,
  }
}
