<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  doc, getDoc, setDoc, collection, serverTimestamp
} from 'firebase/firestore'
import { db } from '@/modules/firebase'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps({
  id: { type: String, default: null } // when editing, it's the doc id (e.g., 'hard')
})

const router   = useRouter()
const loading  = ref(true)
const saving   = ref(false)
const errorMsg = ref('')

// form model
const form = reactive({
  // id is editable only when creating a new race
  id: props.id ?? '',
  title: '',
  blurb: '',
  date: '',
  startTime: '',
  locationCity: '',
  locationName: '',
  isActive: true,

  // numbers
  lengthKm: null,
  runKm: null,
  swimKm: null,
  price: null,

  // arrays
  courseOutline: [],
  equipmentMandatory: [],
  equipmentRecommended: [],
  perks: [],

  // notes / strings
  equipmentPermittedNote: '',
  participantsNote: '',

  // map
  limits: {
    timeHours: null,
    participantLimit: null
  }
})

const isEdit = computed(() => !!props.id)
const pageTitle = computed(() =>
  isEdit.value ? `Edit race: ${props.id}` : 'Create new race'
)

onMounted(load)

async function load() {
  try {
    loading.value = true
    errorMsg.value = ''

    if (!isEdit.value) {
      // new doc: sensible defaults
      form.isActive = true
      form.courseOutline = ['']
      form.equipmentMandatory = ['']
      form.equipmentRecommended = ['']
      form.perks = ['']
      return
    }

    const ref = doc(db, 'races', props.id)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      errorMsg.value = `Race "${props.id}" not found.`
      return
    }

    const data = snap.data()

    // Assign defensively with fallbacks
    form.id                 = props.id
    form.title              = data.title ?? ''
    form.blurb              = data.blurb ?? ''
    form.date               = data.date ?? ''
    form.startTime          = data.startTime ?? ''
    form.locationCity       = data.locationCity ?? ''
    form.locationName       = data.locationName ?? ''
    form.isActive           = data.isActive ?? true

    form.lengthKm           = data.lengthKm ?? null
    form.runKm              = data.runKm ?? null
    form.swimKm             = data.swimKm ?? null
    form.price              = data.price ?? null

    form.courseOutline      = Array.isArray(data.courseOutline) ? [...data.courseOutline] : ['']
    form.equipmentMandatory = Array.isArray(data.equipmentMandatory) ? [...data.equipmentMandatory] : ['']
    form.equipmentRecommended = Array.isArray(data.equipmentRecommended) ? [...data.equipmentRecommended] : ['']
    form.perks              = Array.isArray(data.perks) ? [...data.perks] : ['']

    form.equipmentPermittedNote = data.equipmentPermittedNote ?? ''
    form.participantsNote       = data.participantsNote ?? ''

    form.limits = {
      timeHours: data?.limits?.timeHours ?? null,
      participantLimit: data?.limits?.participantLimit ?? null
    }
  } catch (e) {
    errorMsg.value = e?.message ?? String(e)
  } finally {
    loading.value = false
  }
}

// helpers for repeaters
function addItem(list) {
  list.push('')
}
function removeItem(list, idx) {
  list.splice(idx, 1)
  if (!list.length) list.push('')
}

// normalize + save
function toNumberOrNull(v) {
  if (v === '' || v === null || v === undefined) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function cleanedArray(a) {
  return (a ?? [])
    .map(s => (s ?? '').toString().trim())
    .filter(Boolean)
}

async function save() {
  try {
    saving.value = true
    errorMsg.value = ''

    // validation minimal
    if (!isEdit.value && !form.id.trim()) {
      throw new Error('Please provide an ID (e.g., "hard").')
    }
    if (!form.title.trim()) {
      throw new Error('Title is required.')
    }

    const id = isEdit.value ? props.id : form.id.trim()

    const payload = {
      id,
      title: form.title.trim(),
      blurb: form.blurb.trim(),
      date: form.date || '',
      startTime: form.startTime || '',
      locationCity: form.locationCity.trim(),
      locationName: form.locationName.trim(),
      isActive: !!form.isActive,

      lengthKm: toNumberOrNull(form.lengthKm),
      runKm: toNumberOrNull(form.runKm),
      swimKm: toNumberOrNull(form.swimKm),
      price: toNumberOrNull(form.price),

      courseOutline: cleanedArray(form.courseOutline),
      equipmentMandatory: cleanedArray(form.equipmentMandatory),
      equipmentRecommended: cleanedArray(form.equipmentRecommended),
      perks: cleanedArray(form.perks),

      equipmentPermittedNote: form.equipmentPermittedNote.trim(),
      participantsNote: form.participantsNote.trim(),

      limits: {
        timeHours: toNumberOrNull(form.limits.timeHours),
        participantLimit: toNumberOrNull(form.limits.participantLimit)
      },

      updatedAt: serverTimestamp()
    }

    await setDoc(doc(collection(db, 'races'), id), payload, { merge: true })

    // go back to list or stay—your call. I’ll go back.
    router.push({ name: 'admin-races' })
  } catch (e) {
    errorMsg.value = e?.message ?? String(e)
  } finally {
    saving.value = false
  }
}

function cancel() {
  router.push({ name: 'admin-races' })
}
</script>

<template>
  <div class="p-6 space-y-6">
    <header class="flex items-center justify-between">
      <h1 class="font-title text-3xl text-accent">{{ pageTitle }}</h1>
      <div class="flex gap-3">
        <BaseButton variant="solid" size="sm" @click="cancel">Cancel</BaseButton>
        <BaseButton :disabled="saving" variant="solid" size="sm" @click="save">
          {{ saving ? 'Saving…' : 'Save' }}
        </BaseButton>
      </div>
    </header>

    <div v-if="loading" class="admin-card text-text/70">Loading…</div>
    <div v-else class="grid gap-6 md:grid-cols-3">
      <!-- Left column -->
      <section class="admin-card space-y-4 md:col-span-2">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="!isEdit" class="">
            <label class="ui-label">ID</label>
            <input v-model="form.id" class="ui-input" placeholder="e.g., hard" />
            <p class="ui-hint">Lowercase, URL-safe; used as Firestore doc id.</p>
          </div>

          <div class="">
            <label class="ui-label">Title</label>
            <input v-model="form.title" class="ui-input" placeholder="SwimRun HARD" />
          </div>

          <div>
            <label class="ui-label">Date</label>
            <input v-model="form.date" type="date" class="ui-input" />
          </div>

          <div>
            <label class="ui-label">Start time</label>
            <input v-model="form.startTime" type="time" class="ui-input" />
          </div>

          <div>
            <label class="ui-label">City</label>
            <input v-model="form.locationCity" class="ui-input" placeholder="Ivano-Frankivsk" />
          </div>

          <div>
            <label class="ui-label">Location name</label>
            <input v-model="form.locationName" class="ui-input" placeholder="City lake" />
          </div>

          <div>
            <label class="ui-label">Active</label>
            <div class="flex items-center gap-3">
              <input id="isActive" v-model="form.isActive" type="checkbox" class="h-4 w-4" />
              <label for="isActive" class="font-body text-text/80">Visible & open</label>
            </div>
          </div>
        </div>

        <div>
          <label class="ui-label">Blurb</label>
          <textarea v-model="form.blurb" rows="3" class="ui-input" placeholder="More swim, more fun 💪"></textarea>
        </div>
      </section>

      <!-- Right: quick numbers -->
      <section class="admin-card space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="ui-label">Total length (km)</label>
            <input v-model.number="form.lengthKm" type="number" step="0.1" class="ui-input" />
          </div>
          <div>
            <label class="ui-label">Run (km)</label>
            <input v-model.number="form.runKm" type="number" step="0.1" class="ui-input" />
          </div>
          <div>
            <label class="ui-label">Swim (km)</label>
            <input v-model.number="form.swimKm" type="number" step="0.01" class="ui-input" />
          </div>
          <div>
            <label class="ui-label">Price</label>
            <input v-model.number="form.price" type="number" step="1" class="ui-input" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="ui-label">Time limit (h)</label>
            <input v-model.number="form.limits.timeHours" type="number" step="0.5" class="ui-input" />
          </div>
          <div>
            <label class="ui-label">Participants limit</label>
            <input v-model.number="form.limits.participantLimit" type="number" step="1" class="ui-input" />
          </div>
        </div>
      </section>

      <!-- Arrays / Repeaters -->
      <section class="admin-card space-y-5 md:col-span-3">
        <h2 class="font-title text-xl text-brand">Course outline</h2>
        <div class="space-y-3">
          <div v-for="(val, idx) in form.courseOutline" :key="'co-'+idx" class="flex gap-2">
            <input v-model="form.courseOutline[idx]" class="ui-input flex-1" :placeholder="`Step ${idx+1}`" />
            <BaseButton variant="outline" size="sm" @click="removeItem(form.courseOutline, idx)">Remove</BaseButton>
          </div>
          <BaseButton variant="solid" size="sm" @click="addItem(form.courseOutline)">+ Add step</BaseButton>
        </div>

        <h2 class="font-title text-xl text-brand mt-6">Equipment — Mandatory</h2>
        <div class="space-y-3">
          <div v-for="(val, idx) in form.equipmentMandatory" :key="'em-'+idx" class="flex gap-2">
            <input v-model="form.equipmentMandatory[idx]" class="ui-input flex-1" placeholder="e.g., Swim cap (provided)" />
            <BaseButton variant="outline" size="sm" @click="removeItem(form.equipmentMandatory, idx)">Remove</BaseButton>
          </div>
          <BaseButton variant="solid"  size="sm" @click="addItem(form.equipmentMandatory)">+ Add item</BaseButton>
        </div>

        <h2 class="font-title text-xl text-brand mt-6">Equipment — Recommended</h2>
        <div class="space-y-3">
          <div v-for="(val, idx) in form.equipmentRecommended" :key="'er-'+idx" class="flex gap-2">
            <input v-model="form.equipmentRecommended[idx]" class="ui-input flex-1" placeholder="e.g., Pull buoy" />
            <BaseButton variant="outline" size="sm" @click="removeItem(form.equipmentRecommended, idx)">Remove</BaseButton>
          </div>
          <BaseButton variant="solid" size="sm" @click="addItem(form.equipmentRecommended)">+ Add item</BaseButton>
        </div>

        <h2 class="font-title text-xl text-brand mt-6">Perks</h2>
        <div class="space-y-3">
          <div v-for="(val, idx) in form.perks" :key="'pk-'+idx" class="flex gap-2">
            <input v-model="form.perks[idx]" class="ui-input flex-1" placeholder="e.g., Finisher medal" />
            <BaseButton variant="outline" size="sm" @click="removeItem(form.perks, idx)">Remove</BaseButton>
          </div>
          <BaseButton variant="solid" size="sm" @click="addItem(form.perks)">+ Add perk</BaseButton>
        </div>
      </section>

      <!-- Notes -->
      <section class="admin-card space-y-4 md:col-span-3">
        <div>
          <label class="ui-label">Equipment permitted note</label>
          <textarea v-model="form.equipmentPermittedNote" rows="3" class="ui-input"
            placeholder="Mattresses, vests, buoys, fins, dry bags allowed if carried throughout; leaving gear = DQ."></textarea>
        </div>
        <div>
          <label class="ui-label">Participants note</label>
          <textarea v-model="form.participantsNote" rows="3" class="ui-input"
            placeholder="You are 18+ and able to swim 750m…"></textarea>
        </div>
      </section>
    </div>

    <p v-if="errorMsg" class="text-danger">{{ errorMsg }}</p>
  </div>
</template>
