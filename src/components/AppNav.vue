<template>
  <nav class="nav" aria-label="主导航" @keydown.esc="closeMenu(true)">
    <div class="nav__inner">
      <router-link to="/" class="nav__logo" @click="closeMenu()"><span class="nav__logo-mark" aria-hidden="true">汀</span><span>空白流汀<small>MY LITTLE CORNER</small></span></router-link>
      <ul id="nav-links" class="nav__links" :class="{ 'nav__links--open': menuOpen }">
        <li v-for="link in links" :key="link.to"><router-link :to="link.to" class="nav__link" :class="{ 'nav__link--active': route.fullPath === link.to }" :aria-current="route.fullPath === link.to ? 'page' : undefined" @click="closeMenu()">{{ link.label }}</router-link></li>
      </ul>
      <div class="nav__actions">
        <button class="nav__theme-btn" @click="toggleTheme" :aria-label="currentTheme === 'default' ? '切换到深色模式' : '切换到浅色模式'" :title="getCurrentThemeInfo().name">{{ getCurrentThemeInfo().icon }}</button>
        <button ref="toggleRef" class="nav__toggle" aria-controls="nav-links" :aria-expanded="menuOpen" :aria-label="menuOpen ? '关闭菜单' : '打开菜单'" @click="menuOpen = !menuOpen">{{ menuOpen ? '×' : '☰' }}</button>
      </div>
    </div>
  </nav>
</template>
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme.js'
const { currentTheme, toggleTheme, getCurrentThemeInfo } = useTheme()
const route = useRoute()
const menuOpen = ref(false)
const toggleRef = ref(null)
const links = [{ to: '/', label: '首页' }, { to: '/moments', label: '生活碎片' }, { to: '/#gallery', label: '作品集' }, { to: '/#about', label: '关于我' }, { to: '/#guestbook', label: '留言板' }]
function closeMenu(focus = false) { menuOpen.value = false; if (focus) toggleRef.value?.focus() }
watch(() => route.fullPath, () => closeMenu())
</script>
