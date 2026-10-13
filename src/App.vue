<template>
  <a class="skip-link" href="#main-content">跳到主要内容</a>
  <AppNav />
  <main id="main-content" tabindex="-1"><router-view /></main>
  <AppFooter />
  <MusicPlayer />
  <Teleport to="body">
    <div v-if="lightboxOpen" class="lightbox lightbox--open" role="dialog" aria-modal="true" aria-label="图片预览" @click.self="closeLightbox">
      <button class="lightbox__close" @click="closeLightbox" aria-label="关闭预览">×</button>
      <img class="lightbox__image" :src="lightboxSrc" :alt="lightboxAlt" referrerpolicy="no-referrer">
      <p class="lightbox__caption">{{ lightboxAlt }}</p>
    </div>
    <div class="toast" :class="{ 'toast--show': toastVisible }" role="status">{{ toastMessage }}</div>
  </Teleport>
  <button v-show="showBackToTop" class="back-to-top" aria-label="回到顶部" @click="scrollToTop">↑</button>
</template>
<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue'
import { useLightbox } from './composables/useLightbox.js'
import { useToast } from './composables/useToast.js'
import { useTheme } from './composables/useTheme.js'
import AppNav from './components/AppNav.vue'
import AppFooter from './components/AppFooter.vue'
import MusicPlayer from './components/MusicPlayer.vue'
useTheme().initTheme()
const { lightboxOpen, lightboxSrc, lightboxAlt, openLightbox, closeLightbox, handleKeydown } = useLightbox()
const { toastMessage, toastVisible, showToast } = useToast()
provide('openLightbox', openLightbox)
provide('showToast', showToast)
const showBackToTop = ref(false)
function scrollToTop() { window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }) }
function onScroll() { showBackToTop.value = window.scrollY > 500 }
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('keydown', handleKeydown)
})
</script>
