<template>
  <!-- Loading state while profile data is fetched -->
  <div v-if="loading" class="font-body flex min-h-screen items-center justify-center">
    <p class="text-text/60 text-lg">Loading profile…</p>
  </div>

  <!-- If not logged in, prompt user to log in -->
  <div v-else-if="!currentUser" class="font-body flex min-h-screen items-center justify-center">
    <p class="text-text/60 text-lg">You must be logged in to view this page.</p>
  </div>

  <!-- Profile view for logged-in users -->
  <div v-else class="font-body flex min-h-screen flex-col items-center p-8">
    <div class="admin-card w-full max-w-3xl space-y-10">
      <!-- Profile header with avatar and name -->
      <div class="flex flex-col items-center space-y-4">
        <div class="relative">
          <img
            :src="userData.photoURL || defaultAvatar"
            class="border-accent h-32 w-32 rounded-full border-4 object-cover"
          />
          <!-- Upload profile picture button -->
          <label
            class="bg-accent text-on-brand-text absolute right-0 bottom-0 cursor-pointer rounded-full p-2"
          >
            <i class="fa fa-camera"></i>
            <input type="file" accept="image/*" class="hidden" @change="uploadProfilePic" />
          </label>
        </div>
        <h2 class="font-title text-2xl font-bold">
          Hello {{ userData.fullName || currentUser.email }}!
        </h2>
      </div>

      <!-- Editable personal information section -->
      <div>
        <h3 class="font-title mb-4 text-xl">
          Personal information <span class="text-text/50 text-sm">(from user)</span>
        </h3>
        <div class="space-y-3">
          <div v-for="(field, key) in editableFields" :key="key" class="flex items-center gap-2">
            <label class="text-text/80 w-40 font-medium">{{ field.label }}</label>

            <!-- Editable input fields for text, email, phone -->
            <input
              v-if="editMode[key] && (key === 'fullName' || key === 'email' || key === 'phone')"
              v-model="userData[key]"
              class="ui-input flex-1"
              :placeholder="field.placeholder"
              :type="key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'"
            />

            <!-- Editable select fields for options -->
            <select
              v-else-if="editMode[key] && field.options"
              v-model="userData[key]"
              class="ui-input flex-1"
            >
              <option disabled value="">Select...</option>
              <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
            </select>

            <!-- Editable age field -->
            <input
              v-else-if="editMode[key] && key === 'age'"
              v-model.number="userData[key]"
              type="number"
              class="ui-input flex-1"
              min="18"
              max="99"
              placeholder="18+"
            />

            <!-- Static text if not editing -->
            <span v-else class="border-text/20 flex-1 border-b py-1">{{
              userData[key] || '—'
            }}</span>

            <!-- Toggle edit/save button -->
            <button @click="toggleEdit(key)" class="text-accent text-sm font-medium">
              {{ editMode[key] ? 'Save' : 'Edit' }}
            </button>
          </div>
        </div>

        <!-- Save all edits button -->
        <BaseButton
          class="bg-accent text-on-brand-text mt-6 hover:opacity-90"
          @click="saveAllEdits"
        >
          Update info
        </BaseButton>
      </div>

      <!-- Race registration info section -->
      <div>
        <h3 class="font-title mb-4 text-xl">
          Race information <span class="text-text/50 text-sm">(from database)</span>
        </h3>
        <div v-if="raceData" class="space-y-2">
          <div class="flex gap-4">
            <label class="text-text/80 w-40 font-medium">Race</label>
            <span class="border-text/20 flex-1 border-b py-1">{{ raceData.raceTitle }}</span>
          </div>
          <div class="flex gap-4">
            <label class="text-text/80 w-40 font-medium">Bib number</label>
            <span class="border-text/20 flex-1 border-b py-1">{{ raceData.bib }}</span>
          </div>
          <!-- Delete race registration button -->
          <BaseButton
            class="bg-danger text-on-brand-text mt-4 hover:opacity-90"
            @click="deleteRegistration"
            >Delete race</BaseButton
          >
        </div>
        <div v-else>
          <p class="text-text/50 italic">No race registration found.</p>
        </div>
      </div>
    </div>
  </div>
  <SaveSuccessPrompt
    v-model:open="showSavedPrompt"
    title="Saved"
    message="Your changes have been successfully saved. Would you like to leave the page?"
    confirm-label="Yes"
    cancel-label="No"
    :to="{ name: 'home' }"
  />
</template>

<script setup>
// --- Imports: Vue reactivity, Firebase, Auth, Router, and UI components ---
import { ref, reactive, onMounted, watch } from 'vue'
import { doc, getDoc, collection, getDocs, setDoc, deleteDoc } from 'firebase/firestore'

import { db } from '@/modules/firebase'
import { useAuth } from '@/modules/useAuth'
import BaseButton from '@/components/BaseButton.vue'

import SaveSuccessPrompt from '@/components/SaveSuccessPrompt.vue'
import { useCloudinary } from '@/composables/useCloudinary'
import { useSnackbar } from '@/composables/useSnackbar'

const { showSnack } = useSnackbar()

// --- Get current user and router instance ---
const { currentUser } = useAuth()

// --- Reactive state for user data, race data, edit mode, and loading ---
const userData = reactive({})
const raceData = ref(null)
const editMode = reactive({})
const defaultAvatar = '/default-avatar.png'
const loading = ref(true)
const { uploadImage } = useCloudinary()

// --- List of countries for nationality select field ---
const countries = [
  'Denmark',
  'Sweden',
  'Norway',
  'Finland',
  'Germany',
  'France',
  'UK',
  'USA',
  'Canada',
  'Ukraine',
  'Poland',
  'Netherlands',
  'Other',
]

// --- Editable fields configuration for profile form ---
const editableFields = {
  fullName: { label: 'Full name', placeholder: 'Your name...' },
  email: { label: 'Email', placeholder: 'Your email...' },
  phone: { label: 'Phone number', placeholder: 'Your phone...' },
  age: { label: 'Age', placeholder: 'Your age...' },
  gender: { label: 'Gender', options: ['Male', 'Female', 'Other'] },
  nationality: { label: 'Nationality', options: countries },
  shirtSize: { label: 'Shirt size', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
  mealChoice: { label: 'Choice of meal', options: ['Regular', 'Vegetarian', 'Gluten free'] },
}

// --- Load user data and race registration from Firestore ---
async function loadUserData() {
  if (!currentUser.value) return
  loading.value = true
  try {
    // Load user profile from 'users' collection
    const userRef = doc(db, 'users', currentUser.value.uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) Object.assign(userData, userSnap.data())
    else userData.email = currentUser.value.email

    // Load race registration from 'registrations' subcollection
    const regRef = collection(userRef, 'registrations')
    const regSnap = await getDocs(regRef)
    if (!regSnap.empty) {
      const reg = regSnap.docs[0]
      raceData.value = { id: reg.id, ...reg.data() }
      // Merge race info into userData for participants
      Object.assign(userData, raceData.value) // Kopierer alle felter fra raceData.value over i userData, så race-informationen bliver tilgængelig sammen med brugerens profiloplysninger
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// --- Load user data on mount and when currentUser changes ---
onMounted(() => {
  if (currentUser.value) loadUserData()
})
watch(currentUser, (user) => {
  if (user) loadUserData()
})

// --- Toggle edit mode for a field, and save if toggling off ---
function toggleEdit(key) {
  if (editMode[key]) saveUserInfo()
  editMode[key] = !editMode[key]
}

// --- Save user info to Firestore (users and participants collections) ---
async function saveUserInfo() {
  if (!currentUser.value) return
  try {
    await setDoc(doc(db, 'users', currentUser.value.uid), userData, { merge: true })
    await setDoc(doc(db, 'participants', currentUser.value.uid), userData, { merge: true })
  } catch (err) {
    console.error(err)
    showSnack('Error saving user info.')
  }
}

// --- Save all edits and exit edit mode for all fields ---
const showSavedPrompt = ref(false)
async function saveAllEdits() {
  await saveUserInfo()
  Object.keys(editMode).forEach((k) => (editMode[k] = false)) // Sætter alle felter i editMode til false, så alle input-felter forlader redigeringstilstand

  showSavedPrompt.value = true
}

// --- Upload and update profile picture via Cloudinary URL ---
async function uploadProfilePic(e) {
  const file = e.target.files?.[0]
  if (!file || !currentUser.value) return
  try {
    const url = await uploadImage(file) // SRP: only gets URL
    userData.photoURL = url //  reactive state
    await saveUserInfo() // existing Firestore updater
    showSnack('Profile picture updated!')
  } catch (err) {
    console.error(err)
    showSnack('Failed to upload profile picture.')
  }
}

// --- Delete race registration from Firestore and participants collection ---
async function deleteRegistration() {
  if (!raceData.value) {
    showSnack('No registration to delete.')
    return
  }
  if (!confirm('Are you sure you want to delete your race registration?')) return

  try {
    const userRef = doc(db, 'users', currentUser.value.uid)
    const regRef = doc(collection(userRef, 'registrations'), raceData.value.id)
    await deleteDoc(regRef)

    // Delete participation in participants collection
    const participantRef = doc(db, 'participants', currentUser.value.uid)
    await deleteDoc(participantRef)

    raceData.value = null

    showSnack('Your race registration has been deleted.')
  } catch (err) {
    console.error(err)
    showSnack('Error deleting registration.')
  }
}
</script>
