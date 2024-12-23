<script lang="js" setup>
import { ref } from 'vue'
import { Moon, Sunny } from '@element-plus/icons-vue'

const isDark = ref(document.documentElement.className === 'dark')

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.className = isDark.value ? 'dark' : ''
}
</script>

<template>
  <div class="theme-switcher">
    <el-button
      @click="toggleTheme"
      class="theme-button"
    >
      <el-icon class="theme-icon">
        <component :is="isDark ? Moon : Sunny" />
      </el-icon>
      <span class="button-text">{{ isDark ? 'Сменить тему на светлую' : 'Сменить тему на темную' }}</span>
    </el-button>
  </div>
</template>

<style scoped>
.theme-switcher {
  display: flex;
  top: 20px;
  right: 20px;
  width: 100% !important;
}

.theme-button {
  font-size: 16px;
  width: 90% !important;
  margin-left: 38px;
  margin-top: 25px;
  margin-bottom: 0px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.theme-icon {
  font-size: 20px;
}

.button-text {
  margin-left: 8px;
}
</style>