import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)  // Сначала регистрируем Element Plus
app.mount('#app')     // Затем монтируем приложение