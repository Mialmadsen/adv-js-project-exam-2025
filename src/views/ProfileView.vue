<template>
  <!-- Loading -->
  <div v-if="loading" class="flex justify-center items-center min-h-screen font-body">
    <p class="text-text/60 text-lg">Loading profile…</p>
  </div>

  <!-- Not logged in -->
  <div v-else-if="!currentUser" class="flex justify-center items-center min-h-screen font-body">
    <p class="text-text/60 text-lg">You must be logged in to view this page.</p>
  </div>

  <!-- Profile -->
  <div v-else class="min-h-screen flex flex-col items-center p-8 font-body">
    <div class="admin-card w-full max-w-3xl space-y-10">

      <!-- Header -->
      <div class="flex flex-col items-center space-y-4">
        <div class="relative">
          <img :src="userData.photoURL || defaultAvatar"
               class="w-32 h-32 rounded-full object-cover border-4 border-accent" />
          <label class="absolute bottom-0 right-0 bg-accent text-on-brand-text rounded-full p-2 cursor-pointer">
            <i class="fa fa-camera"></i>
            <input type="file" accept="image/*" class="hidden" @change="uploadProfilePic" />
          </label>
        </div>
        <h2 class="text-2xl font-title font-bold">Hello {{ userData.fullName || currentUser.email }}!</h2>
      </div>

      <!-- Personal Info -->
      <div>
        <h3 class="text-xl font-title mb-4">Personal information <span class="text-text/50 text-sm">(from user)</span></h3>
        <div class="space-y-3">
          <div v-for="(field, key) in editableFields" :key="key" class="flex items-center gap-2">
            <label class="w-40 font-medium text-text/80">{{ field.label }}</label>

            <!-- Input fields -->
            <input v-if="editMode[key] && (key==='fullName'||key==='email'||key==='phone')"
                   v-model="userData[key]"
                   class="ui-input flex-1"
                   :placeholder="field.placeholder"
                   :type="key==='email'?'email':key==='phone'?'tel':'text'" />

            <!-- Select fields -->
            <select v-else-if="editMode[key] && field.options"
                    v-model="userData[key]"
                    class="ui-input flex-1">
              <option disabled value="">Select...</option>
              <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
            </select>

            <!-- Age -->
            <input v-else-if="editMode[key] && key==='age'"
                   v-model.number="userData[key]"
                   type="number"
                   class="ui-input flex-1"
                   min="18"
                   max="99"
                   placeholder="18+" />

            <!-- Static text if not editing -->
            <span v-else class="flex-1 border-b border-text/20 py-1">{{ userData[key] || '—' }}</span>

            <!-- Toggle button -->
            <button @click="toggleEdit(key)" class="text-accent text-sm font-medium">
              {{ editMode[key] ? 'Save' : 'Edit' }}
            </button>
          </div>
        </div>

        <BaseButton class="mt-6 bg-accent text-on-brand-text hover:opacity-90" @click="saveAllEdits">
          Update info
        </BaseButton>
      </div>

      <!-- Race Info -->
      <div>
        <h3 class="text-xl font-title mb-4">Race information <span class="text-text/50 text-sm">(from database)</span></h3>
        <div v-if="raceData" class="space-y-2">
          <div class="flex gap-4">
            <label class="w-40 font-medium text-text/80">Race</label>
            <span class="flex-1 border-b border-text/20 py-1">{{ raceData.raceTitle }}</span>
          </div>
          <div class="flex gap-4">
            <label class="w-40 font-medium text-text/80">Bib number</label>
            <span class="flex-1 border-b border-text/20 py-1">{{ raceData.bib }}</span>
          </div>
          <BaseButton class="mt-4 bg-danger text-on-brand-text hover:opacity-90" @click="deleteRegistration">Delete race</BaseButton>
        </div>
        <div v-else>
          <p class="text-text/50 italic">No race registration found.</p>
        </div>
      </div>

      <!-- Delete Account -->
      <div class="border-t border-text/20 pt-6">
        <h3 class="text-xl font-title mb-4 text-danger">Danger zone</h3>
        <p class="text-text/50 text-sm mb-3">This will permanently delete your profile and race data.</p>
        <BaseButton class="w-full bg-danger text-on-brand-text hover:opacity-90" @click="deleteProfile">
          Delete profile
        </BaseButton>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { doc, getDoc, collection, getDocs, setDoc, deleteDoc } from 'firebase/firestore'
import { getStorage, ref as sRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { deleteUser } from 'firebase/auth'
import { db } from '@/modules/firebase'
import { useAuth } from '@/modules/useAuth'
import BaseButton from '@/components/BaseButton.vue'
import { useRouter } from 'vue-router'

const { currentUser } = useAuth()
const router = useRouter()

const userData = reactive({})
const raceData = ref(null)
const editMode = reactive({})
const defaultAvatar = '/default-avatar.png'
const loading = ref(true)

// Countries for nationality select
const countries = ["Denmark","Sweden","Norway","Finland","Germany","France","UK","USA","Canada","Other"]

const editableFields = {
  fullName: { label: 'Full name', placeholder: 'Your name...' },
  email: { label: 'Email', placeholder: 'Your email...' },
  phone: { label: 'Phone number', placeholder: 'Your phone...' },
  age: { label: 'Age', placeholder: 'Your age...' },
  gender: { label: 'Gender', options: ['Male','Female','Other'] },
  nationality: { label: 'Nationality', options: countries },
  shirtSize: { label: 'Shirt size', options: ['XS','S','M','L','XL','XXL'] },
  mealChoice: { label: 'Choice of meal', options: ['Regular','Vegetarian','Gluten free'] }
}

// Load user data
async function loadUserData() {
  if (!currentUser.value) return
  loading.value = true
  try {
    // Load from users
    const userRef = doc(db, 'users', currentUser.value.uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) Object.assign(userData, userSnap.data())
    else userData.email = currentUser.value.email

    // Load race registration if exists
    const regRef = collection(userRef,'registrations')
    const regSnap = await getDocs(regRef)
    if (!regSnap.empty) {
      const reg = regSnap.docs[0]
      raceData.value = { id: reg.id, ...reg.data() }
      // merge race info into userData for participants
      Object.assign(userData, raceData.value)
    }
  } catch(err){ console.error(err) }
  finally { loading.value = false }
}

onMounted(() => { if (currentUser.value) loadUserData() })
watch(currentUser, (user) => { if (user) loadUserData() })

function toggleEdit(key) {
  if (editMode[key]) saveUserInfo()
  editMode[key] = !editMode[key]
}

// Save profile data in users + participants (merge to avoid duplicates)
async function saveUserInfo() {
  if (!currentUser.value) return
  try {
    await setDoc(doc(db, 'users', currentUser.value.uid), userData, { merge:true })
    await setDoc(doc(db, 'participants', currentUser.value.uid), userData, { merge:true })
  } catch(err){ console.error(err); alert('Error saving user info.') }
}

async function saveAllEdits() {
  await saveUserInfo()
  Object.keys(editMode).forEach(k=>editMode[k]=false)
  alert('All information updated!')
}

// Upload profile picture
async function uploadProfilePic(e) {
  const file = e.target.files[0]
  if (!file || !currentUser.value) return
  const storage = getStorage()
  const fileRef = sRef(storage, `profilePics/${currentUser.value.uid}`)
  try {
    await uploadBytes(fileRef,file)
    const url = await getDownloadURL(fileRef)
    userData.photoURL = url
    await saveUserInfo()
    alert('Profile picture updated!')
  } catch(err){ console.error(err); alert('Failed to upload profile picture.') }
}

// Delete race registration
async function deleteRegistration() {
  if (!raceData.value){ alert('No registration to delete.'); return }
  if (!confirm('Are you sure you want to delete your race registration?')) return
  try {
    const userRef = doc(db,'users',currentUser.value.uid)
    const regRef = doc(collection(userRef,'registrations'), raceData.value.id)
    await deleteDoc(regRef)
    raceData.value = null
    // Fjern race info fra participants
    await setDoc(doc(db,'participants',currentUser.value.uid), { raceTitle:null, bib:null }, { merge:true })
    alert('Your race registration was deleted.')
  } catch(err){ console.error(err); alert('Error deleting registration.') }
}

// Delete entire profile
async function deleteProfile() {
  if (!confirm('⚠️ This will permanently delete your account. Continue?')) return
  try {
    await deleteRegistration()
    const storage = getStorage()
    const picRef = sRef(storage, `profilePics/${currentUser.value.uid}`)
    try{ await deleteObject(picRef) } catch(e){}
    await deleteDoc(doc(db,'users',currentUser.value.uid))
    await deleteDoc(doc(db,'participants',currentUser.value.uid))
    await deleteUser(currentUser.value)
    alert('Your profile and account have been deleted.')
    router.push('/')
  } catch(err){ console.error(err); alert('Error deleting profile. Try logging in again before deleting.') }
}
</script>
