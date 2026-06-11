import { ref } from 'vue'

export function useToast() {
  const toastMessage = ref('')
  const toastVisible = ref(false)
  let toastTimer = null

  function showToast(message) {
    toastMessage.value = message
    toastVisible.value = true

    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      toastVisible.value = false
    }, 2500)
  }

  return { toastMessage, toastVisible, showToast }
}
