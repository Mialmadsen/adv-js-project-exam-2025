export const NUMBER_FIELDS = ['lengthKm', 'runKm', 'swimKm', 'price']
export const ARRAY_FIELDS = ['courseOutline', 'equipmentMandatory', 'equipmentRecommended', 'perks']
export const NOTE_FIELDS = ['equipmentPermittedNote', 'participantsNote']

export const toNumberOrNull = (v) =>
  v === '' || v == null ? null : Number.isFinite(+v) ? +v : null

export const cleanedArray = (a) => (a ?? []).map((s) => (s ?? '').toString().trim()).filter(Boolean)

export const makeDefaults = (id = '') => ({
  id,
  title: '',
  blurb: '',
  date: '',
  startTime: '',
  locationCity: '',
  locationName: '',
  isActive: true,
  lengthKm: null,
  runKm: null,
  swimKm: null,
  price: null,
  courseOutline: [''],
  equipmentMandatory: [''],
  equipmentRecommended: [''],
  perks: [''],
  equipmentPermittedNote: '',
  participantsNote: '',
  limits: { timeHours: null, participantLimit: null },
  imageUrl: '',
})

export const toFormModel = (id, d) => {
  const base = makeDefaults(id)
  if (!d) return base
  const m = { ...base }

  m.title = d.title ?? ''
  m.blurb = d.blurb ?? ''
  m.date = d.date ?? ''
  m.startTime = d.startTime ?? ''
  m.locationCity = d.locationCity ?? ''
  m.locationName = d.locationName ?? ''
  m.isActive = d.isActive ?? true
  m.imageUrl = d.imageUrl ?? ''

  for (const k of NUMBER_FIELDS) m[k] = d[k] ?? null
  for (const k of ARRAY_FIELDS) m[k] = Array.isArray(d[k]) ? [...d[k]] : ['']
  for (const k of NOTE_FIELDS) m[k] = d[k] ?? ''

  m.limits = {
    timeHours: d?.limits?.timeHours ?? null,
    participantLimit: d?.limits?.participantLimit ?? null,
  }
  return m
}

export const toPayload = (fm) => ({
  id: fm.id.trim(),
  title: fm.title.trim(),
  blurb: fm.blurb.trim(),
  date: fm.date || '',
  startTime: fm.startTime || '',
  locationCity: fm.locationCity.trim(),
  locationName: fm.locationName.trim(),
  isActive: !!fm.isActive,
  ...Object.fromEntries(NUMBER_FIELDS.map((k) => [k, toNumberOrNull(fm[k])])),
  ...Object.fromEntries(ARRAY_FIELDS.map((k) => [k, cleanedArray(fm[k])])),
  ...Object.fromEntries(NOTE_FIELDS.map((k) => [k, fm[k].trim()])),
  limits: {
    timeHours: toNumberOrNull(fm.limits.timeHours),
    participantLimit: toNumberOrNull(fm.limits.participantLimit),
  },
  imageUrl: fm.imageUrl.trim(),
})
