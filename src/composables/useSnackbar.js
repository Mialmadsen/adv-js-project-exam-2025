import { reactive } from 'vue'

const state = reactive({
  open: false,
  text: '',
  timeout: 3000,
})

let timer = null

export function useSnackbar() {
  function showSnack(message, ms = 3000) {
    state.text = message
    state.timeout = ms
    state.open = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      state.open = false
    }, ms)
  }
  function hideSnack() {
    state.open = false
  }

  return { state, showSnack, hideSnack }
}
