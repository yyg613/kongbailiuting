<template>
  <article ref="cardRef" class="moment-card reveal" :aria-label="`${moment.date}的动态`">
    <div class="moment-card__dot" aria-hidden="true"></div>
    <div class="moment-card__body">
      <div class="moment-card__header">
        <img class="moment-card__avatar" :src="avatarUrl" alt="" loading="lazy" width="40" height="40">
        <div class="moment-card__meta">
          <span class="moment-card__author">空白流汀</span>
          <time class="moment-card__date" :datetime="moment.date">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            {{ formatDate(moment.date) }}
          </time>
        </div>
      </div>

      <p class="moment-card__content">{{ moment.content }}</p>

      <div v-if="moment.images && moment.images.length > 0" class="moment-card__images">
        <div v-for="(img, index) in moment.images" :key="index" class="moment-card__image-wrap" role="button" tabindex="0" :aria-label="`查看大图 ${index + 1}`" @click="openImage(img, moment.content)" @keydown.enter.prevent="openImage(img, moment.content)" @keydown.space.prevent="openImage(img, moment.content)">
          <img referrerpolicy="no-referrer" class="moment-card__image" :src="img" :alt="moment.content" loading="lazy">
        </div>
      </div>

      <div class="moment-card__footer">
        <span v-if="moment.location" class="moment-card__location">
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>
          {{ moment.location }}
        </span>
        <button class="moment-card__action moment-card__like-btn" :class="{ liked: liked }" aria-label="喜欢" @click="toggleLike">
          <svg viewBox="0 0 24 24" :fill="liked ? 'var(--color-coral)' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          <span class="like-count">{{ displayLikes }}</span>
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { ref, computed, inject, onMounted, nextTick } from 'vue'
import { useReveal } from '../composables/useReveal.js'

const props = defineProps({
  moment: { type: Object, required: true }
})

const openLightbox = inject('openLightbox')

const avatarUrl = import.meta.env.BASE_URL + 'images/avatar.jpg'
const cardRef = ref(null)
const { registerReveal } = useReveal()

const liked = ref(false)
const currentLikeCount = ref(parseLikeValue(props.moment.likes))

function parseLikeValue(val) {
  if (typeof val === 'number') return val
  const match = String(val).match(/^(\d+)(\D*)$/)
  return match ? parseInt(match[1], 10) : 0
}

const displayLikes = computed(() => {
  const val = props.moment.likes
  if (typeof val === 'string' && /[^\d]/.test(val)) {
    const match = val.match(/^(\d+)(.*)$/)
    return match ? currentLikeCount.value + match[2] : currentLikeCount.value
  }
  return currentLikeCount.value
})

function toggleLike() {
  liked.value = !liked.value
  if (liked.value) {
    currentLikeCount.value++
  } else {
    currentLikeCount.value = Math.max(0, currentLikeCount.value - 1)
  }
}

function openImage(src, alt) {
  if (openLightbox) {
    openLightbox(src, alt)
  }
}

function formatDate(dateStr) {
  return dateStr.replace(/-/g, '.')
}

onMounted(() => {
  registerReveal(cardRef.value)
})
</script>
