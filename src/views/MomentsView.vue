<template>
  <header class="page-header">
    <div class="page-header__content">
      <p class="page-header__label">Moments</p>
      <h1 class="page-header__title">生活碎片</h1>
      <p class="page-header__desc">在代码之外捕捉瞬间的温度</p>
    </div>
  </header>

  <section class="section moments" aria-labelledby="moments-title">
    <div class="section__inner">
      <MomentList :moments="allMoments" />
    </div>
  </section>
</template>

<script setup>
import MomentList from '../components/MomentList.vue'
import momentsData from '../data/moments.json'

const allMoments = momentsData
</script>
