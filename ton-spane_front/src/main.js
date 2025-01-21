import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './route.js'
import store from './store'

function getInitialTheme() {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) return savedTheme
  const hours = new Date().getHours()
  return hours >= 6 && hours < 16 ? 'light' : 'dark'
}

const initialTheme = getInitialTheme()
document.documentElement.className = initialTheme
localStorage.setItem('theme', initialTheme)

export function setTheme(newTheme) {
  document.documentElement.className = newTheme
  localStorage.setItem('theme', newTheme)
}

window.addEventListener('error', (error) => {
  if (error.message.includes('ResizeObserver')) {
    error.stopImmediatePropagation()
    return false
  }
  return true
})

window.addEventListener('unhandledrejection', (event) => {
  if (event.reason?.message?.includes('ResizeObserver')) {
    event.stopImmediatePropagation()
    event.preventDefault()
  }
})

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.errorHandler = (err) => {
  if (err.message === 'Script error.' || err.message?.includes('ResizeObserver')) return
  console.error(err)
}

window.onerror = function(msg) {
  if (msg === 'Script error.' || msg?.includes('ResizeObserver')) return false
  return true
}

store.dispatch('initializeStore')

app.use(store)
app.use(ElementPlus)
app.use(router)

app.mount('#app')