import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'  
import App from './App.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// Импортируем роутер
import router from './route.js';

document.documentElement.className = 'dark'


const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }


app.use(ElementPlus)  
app.use(router)
app.mount('#app')
