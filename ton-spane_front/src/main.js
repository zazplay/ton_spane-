import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './route.js'
import store from './store'

// Оптимизация определения темы
const themeManager = {
  getInitialTheme() {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) return savedTheme
    
    const hours = new Date().getHours()
    return hours >= 6 && hours < 16 ? 'dark' : 'light'
  },
  
  setTheme(theme) {
    document.documentElement.className = theme
    localStorage.setItem('theme', theme)
  }
}

// Инициализация приложения
const initApp = () => {
  const app = createApp(App)
  
  // Оптимизация производительности
  app.config.performance = true
  
  // Регистрация иконок
  Object.entries(ElementPlusIconsVue).forEach(([key, component]) => {
    app.component(key, component)
  })
  
  // Обработка ошибок
  app.config.errorHandler = (err) => {
    if (err.message === 'Script error.') return
    console.error('Error:', err.message)
  }
  
  // Инициализация Element Plus
  app.use(ElementPlus, {
    size: 'default',
    zIndex: 3000
  })
  
  // Инициализация store и router
  store.dispatch('initializeStore')
  app.use(store)
  app.use(router)
  
  // Установка начальной темы
  themeManager.setTheme(themeManager.getInitialTheme())
  
  return app
}

// Глобальная обработка ошибок
window.onerror = function(msg, source, lineno) {
  if (msg === 'Script error.') return false
  console.error(`Global error: ${msg}\nSource: ${source}\nLine: ${lineno}`)
  return true
}

// Запуск приложения
const app = initApp()
app.mount('#app')

// Экспорт функции установки темы
export const setTheme = themeManager.setTheme.bind(themeManager)