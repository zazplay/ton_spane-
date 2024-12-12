<template>
  <el-container class="maintenance">
    <el-main class="content">
      <el-image 
        :src="require('@/assets/workingCat.png')"
        alt="Maintenance Cat"
        class="image floating"
        fit="contain"
      />
      
      <el-text tag="h1" class="title" size="large">
        Технические работы
      </el-text>
      
      <el-text class="message" size="large">
        В данный момент мы проводим плановые технические работы
      </el-text>
      
      <el-text class="status" size="large" type="info">
        Мы делаем всё возможное, чтобы вернуть сервис к работе как можно скорее
      </el-text>

      <el-progress
        :percentage="progressValue"
        :stroke-width="4"
        :show-text="false"
        class="progress"
      />
    </el-main>
  </el-container>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'MaintenancePage',
  setup() {
    const progressValue = ref(70)
    
    return {
      progressValue
    }
  }
}
</script>

<style scoped>
.maintenance {
  height: 100vh;
  width: 100%;
  background-color: var(--el-bg-color);
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
  max-width: 70%;
  margin: 0 auto;
  gap: 3%; /* Уменьшил отступ между элементами */
}

.image {
  width: 45%; /* Уменьшил размер картинки */
  margin-bottom: 2%; /* Уменьшил отступ снизу */
}

.floating {
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px); /* Уменьшил амплитуду движения */
  }
  100% {
    transform: translateY(0px);
  }
}

.title {
  margin-bottom: 2%; /* Уменьшил отступ */
  font-size: 250%; /* Уменьшил размер шрифта */
  font-weight: var(--el-font-weight-bold);
  letter-spacing: -0.02em;
}

.message {
  margin-bottom: 2%; /* Уменьшил отступ */
  opacity: 0.85;
  font-size: 120%; /* Уменьшил размер шрифта */
  line-height: 1.3; /* Уменьшил межстрочный интервал */
}

.status {
  font-size: 110%; /* Уменьшил размер шрифта */
  line-height: 1.3; /* Уменьшил межстрочный интервал */
  text-align: center;
  color: var(--el-color-info);
  margin-bottom: 3%; /* Уменьшил отступ */
}

.progress {
  width: 60%; /* Уменьшил ширину прогресс-бара */
}
</style>