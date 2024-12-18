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
      :icon="isDark ? Moon : Sunny"
      @click="toggleTheme"
      circle
      class="theme-button"
    />
  </div>
</template>

<style scoped>
.theme-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}


.theme-button {
  font-size: 20px;
}
</style>