import { ref, computed } from "vue"
import { firebaseApp } from './firebase.js'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth"

const auth = getAuth (firebaseApp)

const currentUser = ref (null)
const isLoggedIn = computed(() => !!currentUser.value);
const authError = ref (null)
const loading = ref (false)

onAuthStateChanged(auth, (user) => {
    currentUser.value = user
})

const login = async (email, password) => {
    console.log("Attempting to log in with email: ", email)
    loading.value = true
    authError.value = null
    try {
        await signInWithEmailAndPassword(auth, email, password)
    }
    catch(error) {
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
        return errorMessage; // can set this into form validation state
        // authError.value = error.message
    }
    finally {
        loading.value = false
    }
}

const register = async ( email, password ) => {
    loading.value = true
    authError.value = null

    try {
        await createUserWithEmailAndPassword(auth, email, password)
    }

    catch (error) {
        authError.value = error.message

    }
    finally {
        loading.value = false
    }
}


const logout = async (routerInstance) => {
    console.log("Logout of this mail: ", currentUser.value?.email)
    loading.value = true
    authError.value = null
    try {
        await signOut(auth)
        if (routerInstance) {
            routerInstance.push('/')  // redirect to home after logout
        }
    }
    catch (error) {
        authError.value = error.message
    }
    finally {
        loading.value = false
    }
}

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