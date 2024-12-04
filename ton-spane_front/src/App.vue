<script>
import MainPage from './components/Page/MainPage.vue';
import { ref, onMounted } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'

export default {
  name: 'App',
  components: {
    MainPage,
    Moon,
    Sunny
  },
  setup() {
    const isDark = ref(document.documentElement.className === 'dark')

    const toggleTheme = () => {
      isDark.value = !isDark.value
      document.documentElement.className = isDark.value ? 'dark' : ''
      localStorage.setItem('theme', isDark.value ? 'dark' : '')
    }

    onMounted(() => {
      // Добавляем обработчики ошибок при монтировании компонента
      window.addEventListener('error', (event) => {
        if (event.message && event.message.includes('ResizeObserver')) {
          event.stopImmediatePropagation();
          return;
        }
        if (event.message === 'Script error.') {
          event.stopImmediatePropagation();
          return;
        }
      });

      window.addEventListener('unhandledrejection', (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();
      });
    })

    return {
      isDark,
      toggleTheme
    }
  }
}
</script>

<template>
  <div class="floating-theme-switcher">
    <el-button
      circle
      class="theme-button"
      @click="toggleTheme"
    >
      <el-icon v-if="isDark">
        <Moon />
      </el-icon>
      <el-icon v-else>
        <Sunny />
      </el-icon>
    </el-button>
  </div>
  <MainPage />
</template>

<style>
/* Метатег для viewport должен быть добавлен в index.html:
<meta name="viewport" content="width=device-width, initial-scale=0.33, maximum-scale=5.0, user-scalable=yes">
*/

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}

.floating-theme-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: auto;
  isolation: isolate;
}

.floating-theme-switcher .theme-button {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.theme-button .el-icon {
  font-size: 20px;
}

/* Мобильные стили */
@media screen and (max-width: 768px) {
  html {
    font-size: 32px !important;
  }

  #app {
    transform-origin: top left;
    font-size: 1rem;
  }

  .floating-theme-switcher {
    top: 40px;
    right: 40px;
    transform: scale(2.5);
    transform-origin: top right;
  }

  .theme-button .el-icon {
    font-size: 24px !important;
  }

  /* Element Plus компоненты */
  .el-button {
    height: auto !important;
    padding: 20px 40px !important;
    font-size: 1rem !important;
  }

  .el-input__inner {
    height: 60px !important;
    line-height: 60px !important;
    font-size: 1rem !important;
  }

  .el-form-item {
    margin-bottom: 30px !important;
  }

  .el-form-item__label {
    font-size: 1rem !important;
    line-height: 2 !important;
  }

  .el-select,
  .el-dropdown,
  .el-menu-item {
    font-size: 1rem !important;
  }

  /* Отступы для компонентов */
  .el-form-item,
  .el-button,
  .el-input,
  .el-select {
    margin: 15px 0 !important;
  }

  /* Контейнеры и сетка */
  .el-container,
  .el-row,
  .el-col {
    width: 100% !important;
    margin: 0 !important;
    padding: 10px !important;
  }

  /* Таблицы */
  .el-table {
    font-size: 1rem !important;
  }

  .el-table th,
  .el-table td {
    padding: 20px !important;
  }
}
</style>