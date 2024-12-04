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

app.use(ElementPlus)
app.use(router)
app.mount('#app')