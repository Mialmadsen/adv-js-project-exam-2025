<template>
  <!-- Page layout: Centered registration form -->
  <div class="flex min-h-screen items-center justify-center p-8">
    <div class="w-full max-w-lg rounded-md bg-white p-8 shadow-lg">
      <!-- Heading -->
      <h2 class="font-title text-accent mb-8 text-center text-3xl font-bold">
        Register for a Race
      </h2>

      <!-- Registration form -->
      <form @submit.prevent="submitRegistration" class="space-y-4">
        <!-- Select Race Dropdown -->
        <div>
          <label class="ui-label">Select Race</label>
          <select v-model="selectedRaceId" class="ui-input" required>
            <option value="" disabled>Select a race</option>
            <option v-for="r in races" :key="r.id" :value="r.id">{{ r.title }}</option>
          </select>
        </div>

        <!-- Extras checkboxes -->
        <div>
          <label class="ui-label">Extras</label>
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="extras.tshirt" />
              T-shirt (+{{ effectiveTshirtPrice || 0 }} DKK)
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="extras.medal" />
              Medal (+{{ effectiveMedalPrice || 0 }} DKK)
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="extras.meal" />
              Meal (Free)
            </label>
          </div>
        </div>

        <!-- Total price display -->
        <div class="mt-8 text-center text-xl font-bold">Total: {{ totalPrice }} DKK</div>

        <!-- Submit button -->
        <BaseButton class="mt-6 w-full py-2" type="submit"> Check out </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
// --- Imports: Vue, router, auth, Firestore, and UI components ---
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/modules/useAuth'
import { collection, getDocs, doc, setDoc, addDoc } from 'firebase/firestore'
import { db } from '@/modules/firebase'
import BaseButton from '@/components/BaseButton.vue'
import { useSnackbar } from '@/composables/useSnackbar'

const { showSnack } = useSnackbar()

// --- Get current user and login state from auth composable ---
const { currentUser, isLoggedIn } = useAuth()
const router = useRouter()

// --- Reactive state for races, selected race, and extras ---
const races = ref([])
const selectedRaceId = ref('')
const extras = ref({ tshirt: false, medal: false, meal: false })

// --- Prices for extras ---
// const tshirtPrice = 100
// const medalPrice = 50

// --- Load all races from Firestore when component mounts ---
async function loadRaces() {
  try {
    const snap = await getDocs(collection(db, 'races'))
    races.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error(err)
    showSnack('Failed to load races')
  }
}
onMounted(() => loadRaces())
const selectedRace = computed(() => races.value.find((r) => r.id === selectedRaceId.value) || null)

const toNumber = (v, fallback) => {
  const n = typeof v === 'number' ? v : v == null ? NaN : Number(v)
  return Number.isFinite(n) ? n : fallback
}

const effectiveTshirtPrice = computed(() => toNumber(selectedRace.value?.tshirtPrice, 100))
const effectiveMedalPrice = computed(() => toNumber(selectedRace.value?.medalPrice, 50))

// --- Compute total price based on selected race and extras ---
const totalPrice = computed(() => {
  if (!selectedRace.value) return 0
  let total = toNumber(selectedRace.value.price, 0)
  if (extras.value.tshirt) total += effectiveTshirtPrice.value
  if (extras.value.medal) total += effectiveMedalPrice.value
  return total
})

// --- Generate a random bib number for the participant ---
function generateBibNumber() {
  return Math.floor(1000 + Math.random() * 9000)
}

// --- Handle form submission for registration ---
async function submitRegistration() {
  // --- Require login ---
  if (!isLoggedIn.value) {
    showSnack('You must be logged in to register!')
    router.push('/auth/login')
    return
  }

  // --- Require race selection ---
  const race = races.value.find((r) => r.id === selectedRaceId.value)
  if (!race) {
    showSnack('Select a race!')
    return
  }

  // --- Check if user already registered for any race ---
  const userRef = doc(db, 'users', currentUser.value.uid)
  const regRef = collection(userRef, 'registrations')
  const existing = await getDocs(regRef)
  if (!existing.empty) {
    showSnack(`You are already registered for a race! You cannot register again.`)
    return
  }

  // --- Prepare registration data ---
  const bib = generateBibNumber()
  const registrationData = {
    user: currentUser.value.email,
    raceId: race.id,
    raceTitle: race.title,
    extras: extras.value,
    total: totalPrice.value,
    bib,
    createdAt: new Date(),
  }

  try {
    // --- Save registration under user in Firestore ---
    await addDoc(regRef, registrationData)

    // --- Save registration in central participants collection (by UID) ---
    const participantDocRef = doc(db, 'participants', currentUser.value.uid)
    await setDoc(
      participantDocRef,
      {
        email: currentUser.value.email,
        raceId: race.id,
        raceTitle: race.title,
        bib,
        extras: extras.value,
        total: totalPrice.value,
        createdAt: new Date(),
      },
      { merge: true },
    ) // merge=true to avoid duplicates

    // --- Store registration in sessionStorage for ThankYouView ---
    sessionStorage.setItem('registration', JSON.stringify(registrationData))

    // --- Redirect to thank you page ---
    router.push('/thankyou')
  } catch (err) {
    console.error('Error saving registration:', err)
    showSnack('There was an error saving your registration.')
  }
}
</script>
