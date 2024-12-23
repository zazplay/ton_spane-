import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './route.js'
import store from './store'

// Функция для определения темы по времени суток
function getThemeByTime() {
  const hours = new Date().getHours()
  // Считаем дневное время с 6 утра до 18 вечера
  return hours >= 6 && hours < 16 ? 'light' : 'dark'
}

// Устанавливаем тему из localStorage или определяем по времени
const savedTheme = localStorage.getItem('theme') || getThemeByTime()
document.documentElement.className = savedTheme

// Функция для обновления темы
function updateTheme() {
  const newTheme = getThemeByTime()
  document.documentElement.className = newTheme
  localStorage.setItem('theme', newTheme)
}

// Обновляем тему каждый час
setInterval(updateTheme, 3600000) // 3600000 мс = 1 час

// Вызываем updateTheme сразу при загрузке
updateTheme()

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// eslint-disable-next-line no-unused-vars
app.config.errorHandler = (err, vm, info) => {
  if (err.message === 'Script error.') {
    return
  }
  console.error(err)
}

// eslint-disable-next-line no-unused-vars
window.onerror = function(msg, url, lineNo, columnNo, error) {
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