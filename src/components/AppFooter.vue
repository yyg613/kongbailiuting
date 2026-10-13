<template>
  <footer class="footer">
    <div class="footer__content">
      <p class="footer__text">
        空白流汀 &copy; {{ new Date().getFullYear() }} · 用心记录每一个瞬间
      </p>
      <nav class="footer__links" aria-label="页脚链接">
        <router-link to="/" class="footer__link">回到顶部</router-link>
        <router-link to="/#about" class="footer__link">关于我</router-link>
        <router-link to="/moments" class="footer__link">动态</router-link>
        <router-link to="/#gallery" class="footer__link">作品</router-link>
        <router-link to="/#guestbook" class="footer__link">留言</router-link>
        <a :href="emailLink" class="footer__link">给我发邮件</a>
      </nav>
    </div>
  </footer>
</template>

<script setup>
import { emailLink } from '../data/contact.js'
</script>
