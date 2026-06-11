<template>
  <div class="gallery__grid">
    <div v-for="item in items" :key="item.id" ref="itemsRef" class="gallery__item reveal" role="button" tabindex="0" :aria-label="`查看作品：${item.title}`" @click="openImage(item.image, item.title)" @keydown.enter.prevent="openImage(item.image, item.title)" @keydown.space.prevent="openImage(item.image, item.title)">
      <img referrerpolicy="no-referrer" class="gallery__image" :src="item.image" :alt="item.title" loading="lazy">
      <div class="gallery__overlay">
        <span class="gallery__item-title">{{ item.title }}</span>
        <span class="gallery__item-desc">{{ item.desc }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { useReveal } from '../composables/useReveal.js'

const props = defineProps({
  items: { type: Array, required: true }
})

const openLightbox = inject('openLightbox')
const itemsRef = ref([])
const { registerReveal } = useReveal()

function openImage(src, alt) {
  if (openLightbox) {
    openLightbox(src, alt)
  }
}

onMounted(() => {
  itemsRef.value.forEach((el) => {
    registerReveal(el)
  })
})
</script>
