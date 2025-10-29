import { ref, computed } from 'vue'

export function useUnsaved() {
  const keys = ref(new Set())

  function markDirty(key) {
    const next = new Set(keys.value)
    next.add(key)
    keys.value = next
  }
  function resetAll() {
    keys.value = new Set()
  }
  const isDirty = (key) => keys.value.has(key)
  const anyDirty = computed(() => keys.value.size > 0)

  // helper: turn Enter into blur (to signal “done”)
  function blurOnEnter(ev) {
    if (ev.key === 'Enter') ev.target?.blur?.()
  }

  return { markDirty, resetAll, isDirty, anyDirty, blurOnEnter }
}
