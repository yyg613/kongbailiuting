<template>
  <div class="guestbook__card">
    <div class="guestbook__prompt"><div><h3>留下一封小小来信</h3><p>使用 GitHub 账号留言。也可以直接前往讨论区。</p></div><button v-if="status === 'idle' || status === 'error'" class="button button--outline" @click="loadComments">{{ status === 'error' ? '重新加载' : '加载留言板' }} ↗</button></div>
    <p v-if="status === 'loading'" role="status">正在连接留言板…</p><p v-if="status === 'error'" role="status">暂时无法连接留言服务，请稍后重试。</p>
    <div ref="container" class="guestbook__utterances"></div>
    <a class="text-link guestbook__fallback" href="https://github.com/yyg613/kongbailiuting/issues" target="_blank" rel="noopener noreferrer">前往 GitHub 讨论区 ↗</a>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useTheme } from '../composables/useTheme.js'
const { currentTheme } = useTheme()
const container = ref(null)
const status = ref('idle')
let timer
function syncTheme() {
  container.value?.querySelector('iframe')?.contentWindow?.postMessage({ type: 'set-theme', theme: currentTheme.value === 'cyberpunk' ? 'github-dark' : 'github-light' }, 'https://utteranc.es')
}
function onMessage(event) {
  if (event.origin !== 'https://utteranc.es' || event.source !== container.value?.querySelector('iframe')?.contentWindow) return
  if (status.value === 'ready') return
  status.value = 'ready'
  clearTimeout(timer)
  syncTheme()
}
function loadComments() {
  clearTimeout(timer)
  container.value.replaceChildren()
  status.value = 'loading'
  const script = document.createElement('script')
  script.src = 'https://utteranc.es/client.js'
  for (const [key, value] of Object.entries({ repo: 'yyg613/kongbailiuting', 'issue-term': 'pathname', label: 'comment', theme: currentTheme.value === 'cyberpunk' ? 'github-dark' : 'github-light', crossorigin: 'anonymous' })) script.setAttribute(key, value)
  script.async = true
  script.onerror = () => { status.value = 'error'; clearTimeout(timer) }
  container.value.appendChild(script)
  timer = setTimeout(() => { if (status.value === 'loading') status.value = 'error' }, 20000)
}
watch(currentTheme, syncTheme)
onMounted(() => window.addEventListener('message', onMessage))
onUnmounted(() => { clearTimeout(timer); window.removeEventListener('message', onMessage) })
</script>
