import { ref } from 'vue'
import { readStorage, writeStorage } from '../utils/storage.js'
const THEME_KEY = 'kongbailiuting-theme'
export const themes = [{ id: 'default', name: '晴日浅色', icon: '☀' }, { id: 'cyberpunk', name: '静夜深色', icon: '☾' }]
const stored = readStorage(THEME_KEY)
const currentTheme = ref(themes.some(t => t.id === stored) ? stored : (matchMedia('(prefers-color-scheme: dark)').matches ? 'cyberpunk' : 'default'))
export function useTheme() {
  function initTheme() {
    document.documentElement.dataset.theme = currentTheme.value
    document.documentElement.style.colorScheme = currentTheme.value === 'cyberpunk' ? 'dark' : 'light'
  }
  function setTheme(id) {
    if (!themes.some(t => t.id === id)) return
    currentTheme.value = id
    writeStorage(THEME_KEY, id)
    initTheme()
  }
  function toggleTheme() { setTheme(currentTheme.value === 'default' ? 'cyberpunk' : 'default') }
  return { currentTheme, themes, initTheme, setTheme, toggleTheme, getCurrentThemeInfo: () => themes.find(t => t.id === currentTheme.value) }
}
