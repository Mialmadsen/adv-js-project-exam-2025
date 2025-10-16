<template>
  <div class="min-h-screen flex items-center justify-center p-8">
    <div class="bg-white shadow-lg rounded-md p-8 w-full max-w-lg">
      <h2 class="text-3xl font-title font-bold text-center text-accent mb-8">
        Register for a Race
      </h2>

      <form @submit.prevent="submitRegistration" class="space-y-4">
        <!-- Select Race -->
        <div>
          <label class="ui-label">Select Race</label>
          <select v-model="selectedRaceId" class="ui-input" required>
            <option value="" disabled>Select a race</option>
            <option v-for="r in races" :key="r.id" :value="r.id">{{ r.title }}</option>
          </select>
        </div>

        <!-- Extras -->
        <div>
          <label class="ui-label">Extras</label>
          <div class="space-y-2">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="extras.tshirt" />
              T-shirt (+100 DKK)
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="extras.medal" />
              Medal (+50 DKK)
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="extras.meal" />
              Meal (Free)
            </label>
          </div>
        </div>

        <!-- Total Price -->
        <div class="text-center mt-8 text-xl font-bold">
          Total: {{ totalPrice }} DKK
        </div>

        <!-- Submit -->
        <BaseButton class="w-full mt-6 py-2" type="submit">
          Check out
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/modules/useAuth'
import { collection, getDocs, doc, setDoc, addDoc } from 'firebase/firestore'
import { db } from '@/modules/firebase'
import BaseButton from '@/components/BaseButton.vue'

const { currentUser, isLoggedIn } = useAuth()
const router = useRouter()

const races = ref([])
const selectedRaceId = ref('')
const extras = ref({ tshirt: false, medal: false, meal: false })

const tshirtPrice = 100
const medalPrice = 50

// --- Load all races from Firestore ---
async function loadRaces() {
  try {
    const snap = await getDocs(collection(db, "races"))
    races.value = snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (err) {
    console.error(err)
    alert("Failed to load races")
  }
}

onMounted(() => loadRaces())

// --- Compute total price dynamically ---
const totalPrice = computed(() => {
  if (!selectedRaceId.value) return 0
  const race = races.value.find(r => r.id === selectedRaceId.value)
  if (!race) return 0
  let total = race.price || 0
  if (extras.value.tshirt) total += tshirtPrice
  if (extras.value.medal) total += medalPrice
  return total
})

// --- Generate bib number ---
function generateBibNumber() {
  return Math.floor(1000 + Math.random() * 9000)
}

// --- Submit registration ---
async function submitRegistration() {
  if (!isLoggedIn.value) {
    alert('You must be logged in to register!')
    router.push('/auth/login')
    return
  }

  const race = races.value.find(r => r.id === selectedRaceId.value)
  if (!race) {
    alert("Select a race!")
    return
  }

  // --- Check if user already registered for ANY race ---
  const userRef = doc(db, "users", currentUser.value.uid)
  const regRef = collection(userRef, "registrations")
  const existing = await getDocs(regRef)

  if (!existing.empty) {
    alert(`You are already registered for a race! You cannot register again.`)
    return
  }

  // --- Proceed with registration ---
  const bib = generateBibNumber()
  const registrationData = {
    user: currentUser.value.email,
    raceId: race.id,
    raceTitle: race.title,
    extras: extras.value,
    total: totalPrice.value,
    bib,
    createdAt: new Date()
  }

  try {
    // Save under user
    await addDoc(regRef, registrationData)

    // Save in central participants collection USING UID as document ID
    const participantDocRef = doc(db, "participants", currentUser.value.uid)
    await setDoc(participantDocRef, {
      email: currentUser.value.email,
      raceId: race.id,
      raceTitle: race.title,
      bib,
      extras: extras.value,
      total: totalPrice.value,
      createdAt: new Date()
    }, { merge: true }) // merge=true for at undgå duplikater

    // Store in session for ThankYouView
    sessionStorage.setItem('registration', JSON.stringify(registrationData))

    router.push('/thankyou')
  } catch (err) {
    console.error("Error saving registration:", err)
    alert("There was an error saving your registration.")
  }
}
</script>
