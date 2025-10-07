import { onMounted, onBeforeUnmount } from 'vue'

export function useClickOutside(boxRef, handler) {
  const onPointerDown = (e) => {
    const el = boxRef?.value
    if (!el) return
    if (!el.contains(e.target)) handler(e)
  }

  onMounted(() => window.addEventListener('pointerdown', onPointerDown))
  onBeforeUnmount(() => window.removeEventListener('pointerdown', onPointerDown))
}
