<template>
  <img v-if="!failed" :src="src" :alt="alt" loading="lazy" decoding="async" referrerpolicy="no-referrer" @error="failed = true">
  <span v-else class="image-fallback" role="img" :aria-label="`${alt}（图片暂时无法加载）`"><span aria-hidden="true">▧</span><span>图片暂时无法加载</span></span>
</template>
<script setup>
import { ref, watch } from 'vue'
const props = defineProps({ src: { type: String, required: true }, alt: { type: String, default: '' } })
const failed = ref(false)
watch(() => props.src, () => { failed.value = false })
</script>
<style scoped>
.image-fallback { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: var(--color-soft); color: var(--color-text-muted); font-size: 11px; }
.image-fallback > span:first-child { font-size: 32px; }
</style>
