<template>
  <header class="hero" id="hero">
    <div class="hero__content">
      <p class="hero__greeting"><span></span> 一个慢慢生长的个人小站</p>
      <h1 class="hero__name">把日子写成诗，<br>把喜欢留在<span>这里。</span></h1>
      <p class="hero__tagline">你好，我是空白流汀。<br>在代码与画笔之间，捕捉生活中每一个温柔的瞬间。</p>
      <div class="hero__actions"><router-link to="/moments" class="button">翻翻生活碎片 <span aria-hidden="true">↗</span></router-link><router-link to="/#about" class="text-link">认识一下我 <span aria-hidden="true">→</span></router-link></div>
      <div class="hero__interests"><span>代码 / CODE</span><span>插画 / ART</span><span>日常 / LIFE</span></div>
    </div>
    <div class="hero__visual" aria-label="空白流汀的个人名片">
      <span class="hero__orbit" aria-hidden="true"></span><span class="hero__star" aria-hidden="true">✳</span>
      <div class="hero__postcard"><span class="hero__tape" aria-hidden="true"></span><img :src="avatarUrl" alt="空白流汀的二次元头像" width="340" height="340" fetchpriority="high"><div class="hero__postcard-caption"><span>给平凡日子，一点浪漫</span><span aria-hidden="true">♡</span></div></div>
      <span class="hero__note">Stay curious, stay soft.</span>
    </div>
    <div class="hero__bottom"><span>记录热爱，也记录成长</span><router-link to="/#moments">向下探索 ↓</router-link><span>EST. 2026</span></div>
  </header>

  <section class="section moments" id="moments" aria-labelledby="moments-title">
    <div class="section__inner">
      <div class="section__header"><div><p class="section__label">01 / RECENT MOMENTS</p><h2 class="section__title" id="moments-title">最近的生活碎片<span>。</span></h2><p class="section__intro">那些不必很隆重，也值得被记住的小事。</p></div><router-link to="/moments" class="text-link">全部 {{ momentsData.length }} 条动态 ↗</router-link></div>
      <MomentList :moments="homeMoments" />
      <div class="moments__more"><router-link to="/moments" class="button button--outline">继续翻阅生活 →</router-link></div>
    </div>
  </section>

  <section class="section gallery" id="gallery" aria-labelledby="gallery-title">
    <div class="section__inner">
      <div class="section__header"><div><p class="section__label">02 / VISUAL DIARY</p><h2 class="section__title" id="gallery-title">一些喜欢的画面<span>。</span></h2><p class="section__intro">收藏灵感，分享创作，让想象有迹可循。</p></div><span class="section__aside">{{ galleryData.length }} 个画面 · 点击放大</span></div>
      <GalleryGrid :items="galleryData" />
    </div>
  </section>

  <section class="section about" id="about" aria-labelledby="about-title">
    <div class="section__inner about__layout">
      <div class="about__heading"><p class="section__label">03 / ABOUT ME</p><h2 class="section__title" id="about-title">很高兴，<br>在这里遇见你。</h2><p class="section__intro">世界很大，这里是我的一小片天地。</p></div>
      <div class="about__card">
        <div class="about__identity"><img class="about__avatar" :src="avatarUrl" alt="" loading="lazy" width="72" height="72"><div><h3 class="about__name">空白流汀</h3><p class="about__title">二次元创作者 / 代码与艺术的探索者</p></div></div>
        <p class="about__bio">喜欢用画笔和键盘记录生活中的美好瞬间。热爱二次元文化、插画创作与前端开发，相信技术与艺术可以交织出最温柔的世界。</p><p class="about__bio">这里有我的日常动态、作品分享，以及一些随心写下的文字。希望你在这里，也能找到一丝温暖与灵感。</p>
        <div class="about__tags"><span v-for="tag in ['插画', '前端开发', '摄影', '游戏', '二次元', '咖啡']" :key="tag" class="about__tag">{{ tag }}</span></div>
        <div class="about__contact">
          <a :href="emailLink" class="button button--outline" :title="contactEmail"><span aria-hidden="true">✉</span> 给我发邮件</a>
          <a href="https://space.bilibili.com/515388738" class="text-link" target="_blank" rel="noopener noreferrer">在 bilibili 找到我 ↗</a>
        </div>
        <p class="about__email">{{ contactEmail }}</p>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="video-title"><div class="section__inner video-section"><div><p class="section__label">ON MY SCREEN</p><h2 id="video-title">分享一个视频</h2><p class="section__intro">歇一会儿，看看今天的小小放映室。</p></div><div class="video-frame"><iframe v-if="videoLoaded" src="https://player.bilibili.com/player.html?isOutside=true&aid=616971477&bvid=BV11h4y1F73Y&cid=1224971263&p=1&autoplay=0" title="空白流汀分享的 B 站视频" loading="lazy" allowfullscreen></iframe><button v-else class="video-placeholder" @click="videoLoaded = true"><span aria-hidden="true">▷</span>点击加载 B 站视频<small>视频由 bilibili 提供</small></button></div></div></section>

  <section class="section guestbook" id="guestbook" aria-labelledby="guestbook-title"><div class="section__inner">
    <div class="section__header"><div><p class="section__label">04 / LEAVE A NOTE</p><h2 class="section__title" id="guestbook-title">来都来了，打个招呼吧<span>。</span></h2><p class="section__intro">一句问候，一个想法，或是今天遇见的小确幸。</p></div><span class="guestbook__stamp" aria-hidden="true">✉</span></div>
    <GuestbookComments />
    <div class="guestbook__messages" role="list" aria-label="精选留言"><div v-for="(msg, index) in guestbookData" :key="index" class="guestbook__message" role="listitem"><div class="guestbook__message-header"><span class="guestbook__message-avatar" aria-hidden="true">{{ msg.avatar }}</span><div><span class="guestbook__message-name">{{ msg.name }}</span><time class="guestbook__message-time" :datetime="msg.time.replaceAll('.', '-')">{{ msg.time }}</time></div></div><p class="guestbook__message-text">{{ msg.text }}</p></div></div>
  </div></section>
</template>
<script setup>
import { ref } from 'vue'
import MomentList from '../components/MomentList.vue'
import GalleryGrid from '../components/GalleryGrid.vue'
import GuestbookComments from '../components/GuestbookComments.vue'
import momentsData from '../data/moments.json'
import galleryData from '../data/gallery.json'
import guestbookData from '../data/guestbook.json'
import { contactEmail, emailLink } from '../data/contact.js'
const avatarUrl = import.meta.env.BASE_URL + 'images/avatar.jpg'
const homeMoments = [...momentsData].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4)
const videoLoaded = ref(false)
</script>
