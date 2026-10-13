import { onUnmounted } from 'vue'
export function useReveal() {
  let observer
  function registerReveal(el) {
    if (!el) return
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('reveal--visible')
      return
    }
    observer ??= new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible')
          observer.unobserve(entry.target)
        }
      }
    }, { threshold: 0.05 })
    observer.observe(el)
  }
  onUnmounted(() => observer?.disconnect())
  return { registerReveal }
}
