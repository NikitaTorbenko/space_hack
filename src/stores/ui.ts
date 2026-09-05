import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Toast {
  id: number
  text: string
  type: 'success' | 'info' | 'gold'
}

let toastId = 0

export const useUiStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([])

  function toast(text: string, type: Toast['type'] = 'info', ttl = 4200): void {
    const id = ++toastId
    toasts.value.push({ id, text, type })
    window.setTimeout(() => remove(id), ttl)
  }

  function remove(id: number): void {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  return { toasts, toast, remove }
})