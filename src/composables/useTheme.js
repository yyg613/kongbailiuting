import { ref } from 'vue'

const THEME_KEY = 'kongbailiuting-theme'

// 主题列表
export const themes = [
  { id: 'default', name: '粉色少女', icon: '🌸' },
  { id: 'cyberpunk', name: '深色模式', icon: '🌙' }
]

// 当前主题（从 localStorage 读取，默认为 default）
const currentTheme = ref(localStorage.getItem(THEME_KEY) || 'default')

export function useTheme() {
  // 设置主题
  function setTheme(themeId) {
    currentTheme.value = themeId
    localStorage.setItem(THEME_KEY, themeId)
    applyTheme(themeId)
  }

  // 切换到下一个主题
  function toggleTheme() {
    const currentIndex = themes.findIndex(t => t.id === currentTheme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex].id)
  }

  // 应用主题到 DOM
  function applyTheme(themeId) {
    document.documentElement.setAttribute('data-theme', themeId)
  }

  // 初始化主题（防止闪烁，在 head 中调用）
  function initTheme() {
    applyTheme(currentTheme.value)
  }

  // 获取当前主题信息
  function getCurrentThemeInfo() {
    return themes.find(t => t.id === currentTheme.value) || themes[0]
  }

  return {
    currentTheme,
    themes,
    setTheme,
    toggleTheme,
    initTheme,
    getCurrentThemeInfo
  }
}
