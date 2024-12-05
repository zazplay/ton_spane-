import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import router from './route.js'

// Получаем сохраненную тему из localStorage или используем тёмную по умолчанию
const savedTheme = localStorage.getItem('theme') || 'dark'
document.documentElement.className = savedTheme

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// eslint-disable-next-line no-unused-vars
app.config.errorHandler = (err, vm, info) => {
  // Игнорируем определенные ошибки
  if (err.message === 'Script error.') {
    return
  }
  // Обработка других ошибок
  console.error(err)
}

// Глобальный обработчик для uncaught ошибок
// eslint-disable-next-line no-unused-vars
window.onerror = function(msg, url, lineNo, columnNo, error) {
  if (msg === 'Script error.') {
    return false
  }
  return true
}

app.use(ElementPlus)
app.use(router)
app.mount('#app')