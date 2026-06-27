<template>
  <div class="bg-layer" aria-hidden="true">
    <div class="bg-layer__gradient"></div>
    <div class="bg-layer__pattern"></div>
  </div>

  <!-- 半透明字母滚动背景 -->
  <div class="letter-rain" aria-hidden="true" ref="letterRainRef"></div>

  <AppNav />

  <router-view />

  <AppFooter />

  <MusicPlayer />

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
import { useTheme } from './composables/useTheme.js'
import AppNav from './components/AppNav.vue'
import AppFooter from './components/AppFooter.vue'
import MusicPlayer from './components/MusicPlayer.vue'

// 初始化主题
const { initTheme } = useTheme()
initTheme()

const { lightboxOpen, lightboxSrc, lightboxAlt, openLightbox, closeLightbox, handleKeydown } = useLightbox()
const { toastMessage, toastVisible, showToast } = useToast()

provide('openLightbox', openLightbox)
provide('showToast', showToast)

const showBackToTop = ref(false)
const letterRainRef = ref(null)

// 字母雨效果
function createLetterRain() {
  if (!letterRainRef.value) return

  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
  const fragment = document.createDocumentFragment()

  for (let i = 0; i < 30; i++) {
    const span = document.createElement('span')
    span.className = 'letter-rain__item'
    span.textContent = letters[Math.floor(Math.random() * letters.length)]
    span.style.left = `${Math.random() * 100}%`
    span.style.animationDuration = `${15 + Math.random() * 20}s`
    span.style.animationDelay = `${Math.random() * 15}s`
    span.style.fontSize = `${14 + Math.random() * 20}px`
    fragment.appendChild(span)
  }

  letterRainRef.value.appendChild(fragment)
}

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
  createLetterRain()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', handleKeydown)
})
</script>
