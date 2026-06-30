<template>
  <header class="hero" id="hero">
    <div class="hero__bg-art" aria-hidden="true">
      <div class="hero__circle hero__circle--1"></div>
      <div class="hero__circle hero__circle--2"></div>
      <div class="hero__circle hero__circle--3"></div>
    </div>
    <div class="hero__content">
      <p class="hero__greeting">Welcome to my world</p>
      <h1 class="hero__name">空白流汀</h1>
      <p class="hero__tagline">在代码与画笔之间，捕捉生活中每一个温柔的瞬间</p>
      <router-link to="/#gallery" class="hero__cta">查看作品</router-link>
    </div>
    <div class="hero__scroll-hint" aria-hidden="true">
      <span class="hero__scroll-text">SCROLL</span>
      <span class="hero__scroll-line"></span>
    </div>
  </header>

  <section class="section about" id="about" aria-labelledby="about-title">
    <div class="section__inner">
      <div class="section__header reveal" ref="aboutHeaderRef">
        <p class="section__label">About Me</p>
        <h2 class="section__title" id="about-title">你好呀</h2>
        <div class="section__divider"></div>
      </div>
      <div class="about__card reveal" ref="aboutCardRef">
        <div class="about__avatar-wrap">
          <img class="about__avatar" :src="avatarUrl" alt="空白流汀的头像" loading="lazy" width="140" height="140">
          <span class="about__avatar-badge" aria-hidden="true">✨</span>
        </div>
        <div class="about__info">
          <h3 class="about__name">空白流汀</h3>
          <p class="about__title">二次元创作者 / 代码与艺术的探索者</p>
          <p class="about__bio">
            喜欢用画笔和键盘记录生活中的美好瞬间。热爱二次元文化、插画创作与前端开发。
            相信技术与艺术可以交织出最温柔的世界。在这里，你可以看到我的日常动态、作品分享，
            以及一些随心写下的文字。希望这些内容能为你带来一丝温暖与灵感。
          </p>
          <div class="about__tags">
            <span class="about__tag">🎨 插画</span>
            <span class="about__tag">💻 前端开发</span>
            <span class="about__tag">📷 摄影</span>
            <span class="about__tag">🎮 游戏</span>
            <span class="about__tag">🌸 二次元</span>
            <span class="about__tag">☕ 咖啡</span>
            <a href="https://space.bilibili.com/515388738" 
               class="about__tag" 
               target="_blank" 
               rel="noopener noreferrer" 
               aria-label="在Bilibili上关注空白流汀">👀 bilibili</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section moments" id="moments" aria-labelledby="moments-title">
    <div class="section__inner">
      <div class="section__header reveal" ref="momentsHeaderRef">
        <p class="section__label">Moments</p>
        <h2 class="section__title" id="moments-title">生活碎片</h2>
        <div class="section__divider"></div>
      </div>

      <MomentList :moments="homeMoments" />

      <div class="moments__more reveal" ref="momentsMoreRef">
        <router-link to="/moments" class="moments__more-btn">
          查看更多动态
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </router-link>
      </div>
    </div>
  </section>

  <section class="section gallery" id="gallery" aria-labelledby="gallery-title">
    <div class="section__inner">
      <div class="section__header reveal" ref="galleryHeaderRef">
        <p class="section__label">Gallery</p>
        <h2 class="section__title" id="gallery-title">作品集</h2>
        <div class="section__divider"></div>
      </div>

      <GalleryGrid :items="galleryItems" />
    </div>
  </section>

  <section class="section guestbook" id="guestbook" aria-labelledby="guestbook-title">
    <div class="section__inner">
      <div class="section__header reveal" ref="guestbookHeaderRef">
        <p class="section__label">Guestbook</p>
        <h2 class="section__title" id="guestbook-title">留言板</h2>
        <div class="section__divider"></div>
      </div>

      <div class="guestbook__card reveal" ref="guestbookCardRef">
        <h3 class="guestbook__card-title">
          <span aria-hidden="true">✉️</span>
          留下你的足迹吧
        </h3>
        <div ref="utterancesContainer" class="guestbook__utterances"></div>
      </div>

      <div class="guestbook__messages" id="guestbook-messages" role="list" aria-label="留言列表">
        <div v-for="(msg, index) in guestbookMessages" :key="index" class="guestbook__message reveal" :ref="el => registerMessageRef(el, index)" role="listitem">
          <div class="guestbook__message-header">
            <div class="guestbook__message-avatar" aria-hidden="true">{{ msg.avatar }}</div>
            <div>
              <div class="guestbook__message-name">{{ msg.name }}</div>
              <div class="guestbook__message-time">{{ msg.time }}</div>
            </div>
          </div>
          <p class="guestbook__message-text">{{ msg.text }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useReveal } from '../composables/useReveal.js'
import MomentList from '../components/MomentList.vue'
import GalleryGrid from '../components/GalleryGrid.vue'
import momentsData from '../data/moments.json'
import galleryData from '../data/gallery.json'
import guestbookData from '../data/guestbook.json'

const { registerReveal } = useReveal()
const avatarUrl = import.meta.env.BASE_URL + 'images/avatar.jpg'

const homeMoments = momentsData.slice(0, 4)
const galleryItems = galleryData
const guestbookMessages = guestbookData

const aboutHeaderRef = ref(null)
const aboutCardRef = ref(null)
const momentsHeaderRef = ref(null)
const momentsMoreRef = ref(null)
const galleryHeaderRef = ref(null)
const guestbookHeaderRef = ref(null)
const guestbookCardRef = ref(null)
const utterancesContainer = ref(null)

const messageRefs = ref([])
function registerMessageRef(el, index) {
  if (el) {
    messageRefs.value[index] = el
    registerReveal(el)
  }
}

function loadUtterances() {
  if (!utterancesContainer.value) return

  const script = document.createElement('script')
  script.src = 'https://utteranc.es/client.js'
  script.setAttribute('repo', 'yyg613/kongbailiuting')
  script.setAttribute('issue-term', 'pathname')
  script.setAttribute('label', 'comment')
  script.setAttribute('theme', 'github-light')
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true

  utterancesContainer.value.appendChild(script)
}

onMounted(async () => {
  const refs = [aboutHeaderRef, aboutCardRef, momentsHeaderRef, momentsMoreRef, galleryHeaderRef, guestbookHeaderRef, guestbookCardRef]
  refs.forEach((r) => {
    if (r.value) registerReveal(r.value)
  })

  await nextTick()
  loadUtterances()
})
</script>
