<!-- <script>
import MainPage from './components/Page/MainPage.vue';

export default {
  name: 'App',
  components: {
    MainPage,
  }
}
</script>

<template>
  <MainPage></MainPage>
 
</template>


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style> -->


<script>
import MainPage from './components/Page/MainPage.vue';
import { ref } from 'vue'
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
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
</style>