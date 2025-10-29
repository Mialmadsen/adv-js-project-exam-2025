import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { doc, getDoc, setDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/modules/firebase'
import { makeDefaults, toFormModel, toPayload } from '@/utils/RaceModel'

// IMPORTANT: getter-based handlers so they always use the current array
const listHandlers = (getArr) => ({
  add: () => {
    const a = getArr()
    a.push('')
  },
  remove: (i) => {
    const a = getArr()
    a.splice(i, 1)
    if (!a.length) a.push('')
  },
})

export function useRaceEditor(propsId) {
  const router = useRouter()
  const loading = ref(true)
  const saving = ref(false)
  const errorMsg = ref('')

  const form = reactive(makeDefaults(propsId ?? ''))

  const isEdit = computed(() => !!propsId)
  const pageTitle = computed(() => (isEdit.value ? `Edit race: ${propsId}` : 'Create new race'))

  // build list helpers with getters (not direct array refs)
  const lists = {
    courseOutline: listHandlers(() => form.courseOutline),
    equipmentMandatory: listHandlers(() => form.equipmentMandatory),
    equipmentRecommended: listHandlers(() => form.equipmentRecommended),
    perks: listHandlers(() => form.perks),
  }

  const fetchRace = async (id) => {
    const r = await getDoc(doc(db, 'races', id))
    return r.exists() ? r.data() : null
  }

  const load = async () => {
    try {
      loading.value = true
      errorMsg.value = ''

      if (!isEdit.value) {
        Object.assign(form, makeDefaults(''))
        return
      }

      const data = await fetchRace(propsId)
      if (!data) {
        errorMsg.value = `Race "${propsId}" not found.`
        Object.assign(form, makeDefaults(propsId))
        return
      }

      Object.assign(form, toFormModel(propsId, data))
    } catch (e) {
      errorMsg.value = e?.message ?? String(e)
    } finally {
      loading.value = false
    }
  }

  const validate = () => {
    if (!isEdit.value && !form.id.trim()) throw new Error('Please provide an ID (e.g., "hard").')
    if (!form.title.trim()) throw new Error('Title is required.')
  }

  const save = async () => {
    try {
      saving.value = true
      errorMsg.value = ''

      validate()
      const id = (isEdit.value ? propsId : form.id).trim()
      const payload = { ...toPayload({ ...form, id }), updatedAt: serverTimestamp() }

      await setDoc(doc(collection(db, 'races'), id), payload, { merge: true })
      return true
    } catch (e) {
      errorMsg.value = e?.message ?? String(e)
    } finally {
      saving.value = false
    }
  }

  const cancel = () => router.push({ name: 'admin-races' })

  return {
    form,
    loading,
    saving,
    errorMsg,
    isEdit,
    pageTitle,
    lists,
    load,
    save,
    cancel,
  }
}
