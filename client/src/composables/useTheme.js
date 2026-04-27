import { ref, watch } from 'vue'

const saved = localStorage.getItem('app-theme') || 'light'
const theme = ref(saved)

function applyTheme(value) {
  document.documentElement.setAttribute('data-theme', value)
  localStorage.setItem('app-theme', value)
}

applyTheme(theme.value)

watch(theme, applyTheme)

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return { theme, toggleTheme }
}
