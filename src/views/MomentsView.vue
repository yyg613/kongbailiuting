<template>
  <header class="page-header">
    <router-link to="/" class="text-link">← 回到首页</router-link>
    <p class="section__label">THE LITTLE THINGS</p>
    <h1 class="page-header__title" id="moments-title">生活碎片<span>。</span></h1>
    <p class="page-header__desc">一些日常，一些灵感，还有认真生活的证据。</p>
  </header>
  <section class="section moments" aria-labelledby="moments-title">
    <div class="section__inner">
      <div class="archive-tools">
        <label class="search-field"><span aria-hidden="true">⌕</span><input v-model="query" type="search" placeholder="搜索文字、地点或日期…" aria-label="搜索动态"></label>
        <label class="archive-month"><span class="sr-only">按月份筛选</span><select v-model="month"><option value="">全部月份</option><option v-for="value in months" :key="value" :value="value">{{ value.replace('-', ' 年 ') }} 月</option></select></label>
        <span class="result-count" role="status">{{ filtered.length }} 条记录</span>
      </div>
      <MomentList v-if="filtered.length" :moments="visibleMoments" />
      <div v-else class="empty-state"><span aria-hidden="true">☁</span><h2>这片天空暂时是空白</h2><p>试试其他关键词，或看看全部生活碎片。</p><button class="button" @click="reset">清除筛选</button></div>
      <div class="moments__more" v-if="visibleMoments.length < filtered.length"><button class="button" @click="limit += 6">再看一些 · 还有 {{ filtered.length - visibleMoments.length }} 条</button></div>
    </div>
  </section>
</template>
<script setup>
import { computed, ref, watch } from 'vue'
import MomentList from '../components/MomentList.vue'
import momentsData from '../data/moments.json'
const allMoments = [...momentsData].sort((a, b) => b.date.localeCompare(a.date))
const query = ref('')
const month = ref('')
const limit = ref(6)
const months = [...new Set(allMoments.map(item => item.date.slice(0, 7)))]
const filtered = computed(() => allMoments.filter(item => item.date.startsWith(month.value) && `${item.content} ${item.location || ''} ${item.date}`.toLocaleLowerCase().includes(query.value.trim().toLocaleLowerCase())))
const visibleMoments = computed(() => filtered.value.slice(0, limit.value))
watch([query, month], () => { limit.value = 6 })
function reset() { query.value = ''; month.value = '' }
</script>
