import { ref, onMounted, onUnmounted, nextTick } from 'vue'

export function useReveal() {
  const revealElements = ref([])

  let observer = null

  function observe(el) {
    if (!el || !('IntersectionObserver' in window)) {
      if (el) el.classList.add('reveal--visible')
      return
    }
    if (!observer) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const parent = entry.target.parentElement
            const siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : []
            const index = siblings.indexOf(entry.target)
            const delay = Math.max(0, index) * 80

            setTimeout(() => {
              entry.target.classList.add('reveal--visible')
            }, delay)

            observer.unobserve(entry.target)
          }
        })
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
      })
    }
    observer.observe(el)
  }

  function registerReveal(el) {
    if (el) {
      observe(el)
    }
  }

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return { registerReveal }
}
