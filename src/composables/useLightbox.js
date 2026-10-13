import { ref, nextTick, onUnmounted } from 'vue'
export function useLightbox() {
  const lightboxOpen = ref(false)
  const lightboxSrc = ref('')
  const lightboxAlt = ref('')
  let previousFocus
  let previousOverflow = ''
  async function openLightbox(src, alt) {
    previousFocus = document.activeElement
    previousOverflow = document.body.style.overflow
    lightboxSrc.value = src
    lightboxAlt.value = alt || '预览图片'
    lightboxOpen.value = true
    document.body.style.overflow = 'hidden'
    await nextTick()
    document.querySelector('.lightbox__close')?.focus()
  }
  function closeLightbox() {
    if (!lightboxOpen.value) return
    lightboxOpen.value = false
    document.body.style.overflow = previousOverflow
    previousFocus?.focus()
    lightboxSrc.value = ''
  }
  function handleKeydown(e) {
    if (!lightboxOpen.value) return
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'Tab') {
      e.preventDefault()
      document.querySelector('.lightbox__close')?.focus()
    }
  }
  onUnmounted(closeLightbox)
  return { lightboxOpen, lightboxSrc, lightboxAlt, openLightbox, closeLightbox, handleKeydown }
}
