<template>
  <div class="bg-layer" aria-hidden="true">
    <div class="bg-layer__gradient"></div>
    <div class="bg-layer__pattern"></div>
  </div>

  <canvas id="leaf-canvas" ref="leafCanvasRef" aria-hidden="true"></canvas>

  <AppNav />

  <router-view />

  <AppFooter />

  <Teleport to="body">
    <div class="lightbox" :class="{ 'lightbox--open': lightboxOpen }" role="dialog" aria-modal="true" aria-label="图片预览" @click="onLightboxBgClick" @keydown="handleKeydown" tabindex="-1">
      <button class="lightbox__close" @click="closeLightbox" aria-label="关闭预览">&times;</button>
      <img class="lightbox__image" :src="lightboxSrc" :alt="lightboxAlt">
    </div>
  </Teleport>

  <Teleport to="body">
    <div class="toast" :class="{ 'toast--show': toastVisible }" role="status" aria-live="polite">{{ toastMessage }}</div>
  </Teleport>

  <button class="back-to-top" :class="{ 'back-to-top--visible': showBackToTop }" aria-label="回到顶部" @click="scrollToTop">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 15l-6-6-6 6"/>
    </svg>
  </button>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue'
import { useLightbox } from './composables/useLightbox.js'
import { useToast } from './composables/useToast.js'
import { useLeafCanvas } from './composables/useLeafCanvas.js'
import AppNav from './components/AppNav.vue'
import AppFooter from './components/AppFooter.vue'

const leafCanvasRef = ref(null)
useLeafCanvas(leafCanvasRef)

const { lightboxOpen, lightboxSrc, lightboxAlt, openLightbox, closeLightbox, handleKeydown } = useLightbox()
const { toastMessage, toastVisible, showToast } = useToast()

provide('openLightbox', openLightbox)
provide('showToast', showToast)

const showBackToTop = ref(false)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onLightboxBgClick(e) {
  if (e.target.classList.contains('lightbox')) {
    closeLightbox()
  }
}

let ticking = false
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      showBackToTop.value = window.scrollY > 400
      ticking = false
    })
    ticking = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', handleKeydown)
})
</script>
