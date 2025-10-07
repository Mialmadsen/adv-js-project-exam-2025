import { ref, computed } from 'vue'


const role = ref('guest') // 'guest' | 'user' | 'admin'

// higher-order helpers
const makeFlag = (name) => computed(() => role.value === name)
const allow    = (...names) => computed(() => names.includes(role.value))

const setRole = (name) => { role.value = name }

export function useRole() {
  return {
    role,
    isGuest: makeFlag('guest'),
    isUser:  makeFlag('user'),
    isAdmin: makeFlag('admin'),
    allow,
    setRole,
  }
}
