// --- Imports: Vue reactivity, Firebase app, Auth & Firestore functions ---
import { ref, computed } from "vue"
import { firebaseApp, db } from './firebase.js'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"

// --- Firebase Auth Setup: Get auth instance from Firebase app ---
const auth = getAuth(firebaseApp)

// --- Reactive State: Track user, login status, errors, and loading state ---
const currentUser = ref(null)
const isLoggedIn = computed(() => !!currentUser.value)
const authError = ref(null)
const loading = ref(false)

// --- Listen for Auth State Changes: Update currentUser when login/logout happens ---
onAuthStateChanged(auth, (user) => {
    currentUser.value = user
})

// --- Login Function: Sign in with email and password, handle errors and loading ---
const login = async (email, password) => {
    loading.value = true
    authError.value = null
    try {
        await signInWithEmailAndPassword(auth, email, password)
    } catch(error) {
        let errorMessage = "";
        switch (error.code) {
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address.";
            break;
          case "auth/user-disabled":
            errorMessage = "This account has been disabled.";
            break;
          case "auth/user-not-found":
            errorMessage = "No account found with this email.";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password. Try again.";
            break;
          case "auth/missing-password":
            errorMessage = "Please enter a password.";
            break;
          default:
            errorMessage = "Login failed. Please try again.";
        }
        console.error(errorMessage);
        authError.value = errorMessage
    } finally {
        loading.value = false
    }
}

// --- Register Function: Create user, add user doc to Firestore with default role ---
const register = async (email, password) => {
    loading.value = true
    authError.value = null

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user

        // --- Create Firestore user document with role "user" ---
        await setDoc(doc(db, "users", user.uid), {
            email: user.email,
            role: "user",
            createdAt: new Date()
        })

    } catch (error) {
        authError.value = error.message
    } finally {
        loading.value = false
    }
}

// --- Logout Function: Sign out and optionally redirect to home ---
const logout = async (routerInstance) => {
    loading.value = true
    authError.value = null
    try {
        await signOut(auth)
        if (routerInstance) {
            routerInstance.push('/')  // redirect to home after logout
        }
    } catch (error) {
        authError.value = error.message
    } finally {
        loading.value = false
    }
}

// --- Export useAuth Composable: Expose state and auth functions for use in components ---
export function useAuth() {
    return {
        currentUser,
        isLoggedIn,
        authError,
        loading,
        login,
        logout,
        register
    }
}
