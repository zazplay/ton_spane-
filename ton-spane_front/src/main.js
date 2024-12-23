import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './route.js'
import store from './store'

// Функция для определения начальной темы
function getInitialTheme() {
  // Проверяем, есть ли сохраненная тема
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    return savedTheme
  }
  
  // Если темы нет, определяем по времени суток
  const hours = new Date().getHours()
  return hours >= 6 && hours < 16 ? 'light' : 'dark'
}

// Устанавливаем начальную тему
const initialTheme = getInitialTheme()
document.documentElement.className = initialTheme
localStorage.setItem('theme', initialTheme)

// Экспортируем функцию для использования в других компонентах
export function setTheme(newTheme) {
  document.documentElement.className = newTheme
  localStorage.setItem('theme', newTheme)
}

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.errorHandler = (err) => {
  if (err.message === 'Script error.') {
    return
  }
  console.error(err)
}

window.onerror = function(msg) {
  if (msg === 'Script error.') {
    return false
  }
  return true
}

store.dispatch('initializeStore')

app.use(store)
app.use(ElementPlus)
app.use(router)

app.mount('#app')