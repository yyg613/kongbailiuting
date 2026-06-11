<template>
  <nav class="nav" :class="{ 'nav--scrolled': scrolled }" id="nav" role="navigation" aria-label="主导航">
    <div class="nav__inner">
      <router-link to="/" class="nav__logo" aria-label="空白流汀 - 返回首页">
        <span class="nav__logo-leaf" aria-hidden="true">🍃</span>
        <span>空白流汀</span>
      </router-link>
      <button class="nav__toggle" :class="{ 'nav__toggle--open': menuOpen }" id="nav-toggle" :aria-label="menuOpen ? '关闭菜单' : '打开菜单'" :aria-expanded="String(menuOpen)" @click="toggleMenu">
        <span class="nav__toggle-line"></span>
        <span class="nav__toggle-line"></span>
        <span class="nav__toggle-line"></span>
      </button>
      <ul class="nav__links" :class="{ 'nav__links--open': menuOpen }" id="nav-links" role="list" @click="closeMenu">
        <li><router-link to="/#about" class="nav__link" exact-active-class="nav__link--active">关于</router-link></li>
        <li><router-link to="/moments" class="nav__link" exact-active-class="nav__link--active">动态</router-link></li>
        <li><router-link to="/#gallery" class="nav__link" exact-active-class="nav__link--active">作品</router-link></li>
        <li><router-link to="/#guestbook" class="nav__link" exact-active-class="nav__link--active">留言</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)
const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  document.body.style.overflow = menuOpen.value ? 'hidden' : ''
}

function closeMenu() {
  menuOpen.value = false
  document.body.style.overflow = ''
}

let ticking = false
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      scrolled.value = window.scrollY > 40
      ticking = false
    })
    ticking = true
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  document.body.style.overflow = ''
})
</script>
