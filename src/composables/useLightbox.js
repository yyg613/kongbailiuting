import { ref } from 'vue'

export function useLightbox() {
  const lightboxOpen = ref(false)
  const lightboxSrc = ref('')
  const lightboxAlt = ref('')

  function openLightbox(src, alt) {
    lightboxSrc.value = src
    lightboxAlt.value = alt || '预览图片'
    lightboxOpen.value = true
    document.body.style.overflow = 'hidden'
  }

  function closeLightbox() {
    lightboxOpen.value = false
    document.body.style.overflow = ''
    lightboxSrc.value = ''
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && lightboxOpen.value) {
      closeLightbox()
    }
  }

  return { lightboxOpen, lightboxSrc, lightboxAlt, openLightbox, closeLightbox, handleKeydown }
}
