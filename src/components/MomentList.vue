<template>
  <div class="moments__timeline">
    <MomentCard v-for="item in moments" :key="item.id" :moment="item" />
  </div>
</template>

<script setup>
import MomentCard from './MomentCard.vue'

defineProps({
  moments: { type: Array, required: true }
})
</script>
