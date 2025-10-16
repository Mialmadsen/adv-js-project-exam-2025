<template>
  <!-- Loading state while profile data is fetched -->
  <div v-if="loading" class="flex justify-center items-center min-h-screen font-body">
    <p class="text-text/60 text-lg">Loading profile…</p>
  </div>

  <!-- If not logged in, prompt user to log in -->
  <div v-else-if="!currentUser" class="flex justify-center items-center min-h-screen font-body">
    <p class="text-text/60 text-lg">You must be logged in to view this page.</p>
  </div>

  <!-- Profile view for logged-in users -->
  <div v-else class="min-h-screen flex flex-col items-center p-8 font-body">
    <div class="admin-card w-full max-w-3xl space-y-10">

      <!-- Profile header with avatar and name -->
      <div class="flex flex-col items-center space-y-4">
        <div class="relative">
          <img :src="userData.photoURL || defaultAvatar"
               class="w-32 h-32 rounded-full object-cover border-4 border-accent" />
          <!-- Upload profile picture button -->
          <label class="absolute bottom-0 right-0 bg-accent text-on-brand-text rounded-full p-2 cursor-pointer">
            <i class="fa fa-camera"></i>
            <input type="file" accept="image/*" class="hidden" @change="uploadProfilePic" />
          </label>
        </div>
        <h2 class="text-2xl font-title font-bold">Hello {{ userData.fullName || currentUser.email }}!</h2>
      </div>

      <!-- Editable personal information section -->
      <div>
        <h3 class="text-xl font-title mb-4">Personal information <span class="text-text/50 text-sm">(from user)</span></h3>
        <div class="space-y-3">
          <div v-for="(field, key) in editableFields" :key="key" class="flex items-center gap-2">
            <label class="w-40 font-medium text-text/80">{{ field.label }}</label>

            <!-- Editable input fields for text, email, phone -->
            <input v-if="editMode[key] && (key==='fullName'||key==='email'||key==='phone')"
                   v-model="userData[key]"
                   class="ui-input flex-1"
                   :placeholder="field.placeholder"
                   :type="key==='email'?'email':key==='phone'?'tel':'text'" />

            <!-- Editable select fields for options -->
            <select v-else-if="editMode[key] && field.options"
                    v-model="userData[key]"
                    class="ui-input flex-1">
              <option disabled value="">Select...</option>
              <option v-for="opt in field.options" :key="opt" :value="opt">{{ opt }}</option>
            </select>

            <!-- Editable age field -->
            <input v-else-if="editMode[key] && key==='age'"
                   v-model.number="userData[key]"
                   type="number"
                   class="ui-input flex-1"
                   min="18"
                   max="99"
                   placeholder="18+" />

            <!-- Static text if not editing -->
            <span v-else class="flex-1 border-b border-text/20 py-1">{{ userData[key] || '—' }}</span>

            <!-- Toggle edit/save button -->
            <button @click="toggleEdit(key)" class="text-accent text-sm font-medium">
              {{ editMode[key] ? 'Save' : 'Edit' }}
            </button>
          </div>
        </div>

        <!-- Save all edits button -->
        <BaseButton class="mt-6 bg-accent text-on-brand-text hover:opacity-90" @click="saveAllEdits">
          Update info
        </BaseButton>
      </div>

      <!-- Race registration info section -->
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
          <!-- Delete race registration button -->
          <BaseButton class="mt-4 bg-danger text-on-brand-text hover:opacity-90" @click="deleteRegistration">Delete race</BaseButton>
        </div>
        <div v-else>
          <p class="text-text/50 italic">No race registration found.</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { doc, getDoc, collection, getDocs, setDoc, deleteDoc } from 'firebase/firestore'
import { getStorage, ref as sRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
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

async function loadUserData() {
  if (!currentUser.value) return
  loading.value = true
  try {
    const userRef = doc(db, 'users', currentUser.value.uid)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) Object.assign(userData, userSnap.data())
    else userData.email = currentUser.value.email

    const regRef = collection(userRef,'registrations')
    const regSnap = await getDocs(regRef)
    if (!regSnap.empty) {
      const reg = regSnap.docs[0]
      raceData.value = { id: reg.id, ...reg.data() }
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

async function deleteRegistration() {
  if (!raceData.value) { 
    alert('No registration to delete.'); 
    return;
  }
  if (!confirm('Are you sure you want to delete your race registration?')) return;

  try {
    const userRef = doc(db,'users',currentUser.value.uid)
    const regRef = doc(collection(userRef,'registrations'), raceData.value.id)
    await deleteDoc(regRef)

    // Slet deltagelse i participants collection
    const participantRef = doc(db,'participants',currentUser.value.uid)
    await deleteDoc(participantRef)

    raceData.value = null

    alert('Your race registration has been deleted.')
  } catch(err){
    console.error(err)
    alert('Error deleting registration.')
  }
}
</script>
